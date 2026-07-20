import path from 'path';
import { fileURLToPath } from 'url';

// Path safety for the dev authoring write API. Every filesystem path the
// middleware touches is built here and constrained to two roots, so a crafted
// id can never escape the repo (path-traversal defense).

const here = path.dirname(fileURLToPath(import.meta.url));
// tools/vln-authoring/fsSafe.mjs -> repo root is two levels up.
export const repoRoot = path.resolve(here, '..', '..');

export const ASSETS_ROOT = path.join(repoRoot, 'src', 'assets', 'jude');
export const PUBLIC_ROOT = path.join(repoRoot, 'public', 'jude');
export const compositesIndexPath = path.join(PUBLIC_ROOT, 'composites.json');

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

export function assertValidId(id, label = 'id') {
    if (typeof id !== 'string' || !ID_PATTERN.test(id)) {
        throw new HttpError(400, `Invalid ${label}: must be lowercase-hyphenated (e.g. "neck").`);
    }
    return id;
}

// Resolve a path under `root` and refuse anything that escapes it.
export function resolveWithin(root, ...segments) {
    const rootResolved = path.resolve(root);
    const resolved = path.resolve(rootResolved, ...segments);
    if (resolved !== rootResolved && !resolved.startsWith(rootResolved + path.sep)) {
        throw new HttpError(400, 'Resolved path escapes its allowed directory.');
    }
    return resolved;
}

export function compositeAssetsDir(id) {
    assertValidId(id, 'composite id');
    return resolveWithin(ASSETS_ROOT, id);
}

export function compositePublicDir(id) {
    assertValidId(id, 'composite id');
    return resolveWithin(PUBLIC_ROOT, id);
}

export function manifestPath(id) {
    return resolveWithin(compositePublicDir(id), 'manifest.json');
}

export function notesDir(id) {
    return resolveWithin(compositePublicDir(id), 'notes');
}

export function layerImageFile(id, layerId) {
    assertValidId(layerId, 'layer id');
    return resolveWithin(compositeAssetsDir(id), `${layerId}.png`);
}

export function noteFile(id, noteId) {
    assertValidId(noteId, 'note id');
    return resolveWithin(notesDir(id), `${noteId}.pdf`);
}
