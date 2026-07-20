import fs from 'fs/promises';
import path from 'path';
import {
    HttpError,
    assertValidId,
    compositeAssetsDir,
    compositePublicDir,
    manifestPath,
    notesDir,
    layerImageFile,
    noteFile,
    compositesIndexPath,
} from './fsSafe.mjs';
import {
    validateManifest,
    createEmptyManifest,
} from '../../src/components/visually-layered-notes/manifestSchema.js';
import { optimizeImages } from '../../optimize-images.mjs';

const PREFIX = '/__vln-authoring';
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function json(res, status, body) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(body));
}

function readRawBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let size = 0;
        req.on('data', (chunk) => {
            size += chunk.length;
            if (size > MAX_UPLOAD_BYTES) {
                reject(new HttpError(413, 'Upload exceeds the size limit.'));
                req.destroy();
                return;
            }
            chunks.push(chunk);
        });
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
    });
}

async function readJsonBody(req) {
    const buf = await readRawBody(req);
    try {
        return JSON.parse(buf.toString('utf-8') || '{}');
    } catch {
        throw new HttpError(400, 'Request body must be valid JSON.');
    }
}

async function readComposites() {
    try {
        const raw = await fs.readFile(compositesIndexPath, 'utf-8');
        const data = JSON.parse(raw);
        return Array.isArray(data?.composites) ? data.composites : [];
    } catch {
        return [];
    }
}

async function writeComposites(composites) {
    await fs.mkdir(path.dirname(compositesIndexPath), { recursive: true });
    await fs.writeFile(compositesIndexPath, `${JSON.stringify({ composites }, null, 2)}\n`);
}

async function upsertCompositeEntry(id, label) {
    const composites = await readComposites();
    const index = composites.findIndex((entry) => entry.id === id);
    if (index === -1) composites.push({ id, label });
    else composites[index] = { id, label };
    await writeComposites(composites);
    return composites;
}

const compositeScope = (id) => path.join('jude', id);

async function createComposite(req, res) {
    const body = await readJsonBody(req);
    const { id, name, canvas } = body ?? {};
    assertValidId(id, 'composite id');

    const draft = createEmptyManifest({ id, name, canvas });
    const { valid, errors, normalized } = validateManifest(draft);
    if (!valid) throw new HttpError(400, errors.join(' '));

    const mPath = manifestPath(id);
    let exists = true;
    try {
        await fs.access(mPath);
    } catch {
        exists = false;
    }
    if (exists) throw new HttpError(409, `Composite "${id}" already exists.`);

    await fs.mkdir(compositeAssetsDir(id), { recursive: true });
    await fs.mkdir(notesDir(id), { recursive: true });
    await fs.writeFile(mPath, `${JSON.stringify(normalized, null, 2)}\n`);
    const composites = await upsertCompositeEntry(id, normalized.name);

    json(res, 201, { manifest: normalized, composites });
}

async function readManifest(res, id) {
    assertValidId(id, 'composite id');
    try {
        const raw = await fs.readFile(manifestPath(id), 'utf-8');
        json(res, 200, { manifest: JSON.parse(raw) });
    } catch {
        throw new HttpError(404, `Composite "${id}" not found.`);
    }
}

async function writeManifest(req, res, id) {
    assertValidId(id, 'composite id');
    const body = await readJsonBody(req);
    const manifest = body?.manifest ?? body;
    if (manifest?.id !== id) throw new HttpError(400, 'Manifest id must match the URL.');

    const { valid, errors, warnings, normalized } = validateManifest(manifest);
    if (!valid) {
        json(res, 422, { valid, errors, warnings });
        return;
    }

    await fs.mkdir(compositePublicDir(id), { recursive: true });
    await fs.writeFile(manifestPath(id), `${JSON.stringify(normalized, null, 2)}\n`);
    const composites = await upsertCompositeEntry(id, normalized.name);

    json(res, 200, { valid, errors, warnings, manifest: normalized, composites });
}

async function uploadLayerImage(req, res, id, layerId) {
    assertValidId(id, 'composite id');
    assertValidId(layerId, 'layer id');
    const buf = await readRawBody(req);
    if (buf.length < 8 || !buf.subarray(0, 8).equals(PNG_MAGIC)) {
        throw new HttpError(415, 'Layer image must be a PNG (transparency required).');
    }
    await fs.mkdir(compositeAssetsDir(id), { recursive: true });
    await fs.writeFile(layerImageFile(id, layerId), buf);
    await optimizeImages({ only: compositeScope(id) });
    json(res, 200, { image: `jude/${id}/${layerId}` });
}

async function deleteLayerImage(res, id, layerId) {
    assertValidId(id, 'composite id');
    assertValidId(layerId, 'layer id');
    await fs.rm(layerImageFile(id, layerId), { force: true });
    await optimizeImages({ only: compositeScope(id) }); // prunes optimized variants
    json(res, 200, { ok: true });
}

async function uploadNotePdf(req, res, id, noteId) {
    assertValidId(id, 'composite id');
    assertValidId(noteId, 'note id');
    const buf = await readRawBody(req);
    if (buf.subarray(0, 5).toString('latin1') !== '%PDF-') {
        throw new HttpError(415, 'Note file must be a PDF.');
    }
    await fs.mkdir(notesDir(id), { recursive: true });
    await fs.writeFile(noteFile(id, noteId), buf);
    json(res, 200, { file: `/jude/${id}/notes/${noteId}.pdf` });
}

async function deleteNotePdf(res, id, noteId) {
    assertValidId(id, 'composite id');
    assertValidId(noteId, 'note id');
    await fs.rm(noteFile(id, noteId), { force: true });
    json(res, 200, { ok: true });
}

async function optimizeComposite(res, id) {
    assertValidId(id, 'composite id');
    await optimizeImages({ only: compositeScope(id) });
    json(res, 200, { ok: true });
}

// Connect-style middleware. Handles `/__vln-authoring/*`, otherwise calls next().
export default async function handleAuthoringRequest(req, res, next) {
    const pathname = (req.url ?? '').split('?')[0];
    if (pathname !== PREFIX && !pathname.startsWith(`${PREFIX}/`)) {
        return next();
    }

    try {
        const rest = pathname.slice(PREFIX.length).replace(/\/+$/, '');
        const parts = rest.split('/').filter(Boolean);
        const method = (req.method ?? 'GET').toUpperCase();

        if (parts.length === 1 && parts[0] === 'composites') {
            if (method === 'GET') return json(res, 200, { composites: await readComposites() });
            if (method === 'POST') return await createComposite(req, res);
            throw new HttpError(405, 'Method not allowed.');
        }

        if (parts[0] === 'composites' && parts.length >= 3) {
            const id = parts[1];
            const resource = parts[2];

            if (resource === 'manifest' && parts.length === 3) {
                if (method === 'GET') return await readManifest(res, id);
                if (method === 'PUT') return await writeManifest(req, res, id);
                throw new HttpError(405, 'Method not allowed.');
            }

            if (resource === 'optimize' && parts.length === 3 && method === 'POST') {
                return await optimizeComposite(res, id);
            }

            if (resource === 'layers' && parts.length === 5 && parts[4] === 'image') {
                const layerId = parts[3];
                if (method === 'POST' || method === 'PUT') return await uploadLayerImage(req, res, id, layerId);
                if (method === 'DELETE') return await deleteLayerImage(res, id, layerId);
                throw new HttpError(405, 'Method not allowed.');
            }

            if (resource === 'notes' && parts.length === 5 && parts[4] === 'pdf') {
                const noteId = parts[3];
                if (method === 'POST' || method === 'PUT') return await uploadNotePdf(req, res, id, noteId);
                if (method === 'DELETE') return await deleteNotePdf(res, id, noteId);
                throw new HttpError(405, 'Method not allowed.');
            }
        }

        throw new HttpError(404, 'Unknown authoring endpoint.');
    } catch (err) {
        const status = err instanceof HttpError ? err.status : 500;
        if (status === 500) console.error('[vln-authoring]', err);
        json(res, status, { error: err?.message ?? 'Server error.' });
    }
}
