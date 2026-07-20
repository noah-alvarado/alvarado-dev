// Shared, dependency-free validation + normalization for composite manifests.
//
// This module is imported by BOTH the browser authoring UI and the Node dev-server
// write middleware, so it must stay pure JavaScript — no React, no Node built-ins.
// It owns the single source of truth for id/path conventions and the manifest shape.

export const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidId(value) {
    return typeof value === 'string' && ID_PATTERN.test(value);
}

function nonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

function isPositiveInt(value) {
    return Number.isInteger(value) && value > 0;
}

// Canonical resource paths, derived from ids so the convention lives in one place.
export function layerImagePath(compositeId, layerId) {
    return `jude/${compositeId}/${layerId}`;
}

export function noteFilePath(compositeId, noteId) {
    return `/jude/${compositeId}/notes/${noteId}.pdf`;
}

// Dedupe + trim a tag list, preserving first-seen order.
export function normalizeTags(tags = []) {
    const seen = new Set();
    const out = [];
    for (const raw of tags ?? []) {
        const tag = String(raw).trim();
        if (tag && !seen.has(tag)) {
            seen.add(tag);
            out.push(tag);
        }
    }
    return out;
}

// The top-level vocabulary is derived, never hand-edited: the sorted union of
// every tag used by a layer or a note.
export function deriveTags(layers = [], notes = []) {
    const set = new Set();
    for (const layer of layers) for (const tag of layer.tags ?? []) set.add(tag);
    for (const note of notes) for (const tag of note.tags ?? []) set.add(tag);
    return [...set].sort();
}

export function createEmptyManifest({ id, name, canvas } = {}) {
    return {
        id,
        name: name ?? id,
        canvas: {
            width: canvas?.width ?? 1200,
            height: canvas?.height ?? 1500,
        },
        layers: [],
        notes: [],
        tags: [],
    };
}

// Produce a clean, canonical manifest: derived image/file paths, normalized tags,
// layers ordered back-to-front (highest order first, matching the panel), and a
// derived top-level tag vocabulary. Assumes the input already passed validation.
export function normalizeManifest(manifest) {
    const layers = (manifest.layers ?? [])
        .map((layer) => ({
            id: layer.id,
            name: layer.name.trim(),
            image: layerImagePath(manifest.id, layer.id),
            order: layer.order,
            tags: normalizeTags(layer.tags),
        }))
        .sort((a, b) => b.order - a.order);

    const notes = (manifest.notes ?? []).map((note) => ({
        id: note.id,
        title: note.title.trim(),
        file: noteFilePath(manifest.id, note.id),
        tags: normalizeTags(note.tags),
    }));

    return {
        id: manifest.id,
        name: manifest.name.trim(),
        canvas: {
            width: Math.round(manifest.canvas.width),
            height: Math.round(manifest.canvas.height),
        },
        layers,
        notes,
        tags: deriveTags(layers, notes),
    };
}

// Validate a draft manifest's structure. Returns:
//   { valid, errors[], warnings[], normalized } — normalized is null when invalid.
// Errors block a save; warnings are surfaced but allowed (e.g. a layer with no
// matching notes is valid — it simply hides on click).
export function validateManifest(manifest) {
    const errors = [];
    const warnings = [];

    if (!manifest || typeof manifest !== 'object') {
        return { valid: false, errors: ['Manifest must be an object.'], warnings, normalized: null };
    }

    if (!isValidId(manifest.id)) {
        errors.push('Composite id must be lowercase-hyphenated (e.g. "neck", "left-hand").');
    }
    if (!nonEmptyString(manifest.name)) {
        errors.push('Composite name is required.');
    }

    const canvas = manifest.canvas;
    if (!canvas || !isPositiveInt(canvas.width) || !isPositiveInt(canvas.height)) {
        errors.push('Canvas width and height must be positive integers.');
    }

    const layers = Array.isArray(manifest.layers) ? manifest.layers : [];
    if (!Array.isArray(manifest.layers)) errors.push('layers must be an array.');
    const layerIds = new Set();
    layers.forEach((layer, index) => {
        const label = `Layer ${index + 1}`;
        if (!isValidId(layer?.id)) {
            errors.push(`${label}: id must be lowercase-hyphenated.`);
        } else if (layerIds.has(layer.id)) {
            errors.push(`${label}: duplicate id "${layer.id}".`);
        } else {
            layerIds.add(layer.id);
        }
        if (!nonEmptyString(layer?.name)) errors.push(`${label} ("${layer?.id ?? '?'}"): name is required.`);
        if (!Number.isInteger(layer?.order)) errors.push(`${label} ("${layer?.id ?? '?'}"): order must be an integer.`);
        if (!Array.isArray(layer?.tags)) errors.push(`${label} ("${layer?.id ?? '?'}"): tags must be an array.`);
    });

    const notes = Array.isArray(manifest.notes) ? manifest.notes : [];
    if (!Array.isArray(manifest.notes)) errors.push('notes must be an array.');
    const noteIds = new Set();
    notes.forEach((note, index) => {
        const label = `Note ${index + 1}`;
        if (!isValidId(note?.id)) {
            errors.push(`${label}: id must be lowercase-hyphenated.`);
        } else if (noteIds.has(note.id)) {
            errors.push(`${label}: duplicate id "${note.id}".`);
        } else {
            noteIds.add(note.id);
        }
        if (!nonEmptyString(note?.title)) errors.push(`${label} ("${note?.id ?? '?'}"): title is required.`);
        if (!Array.isArray(note?.tags)) errors.push(`${label} ("${note?.id ?? '?'}"): tags must be an array.`);
    });

    // Structural warnings only make sense once the shape is sound.
    if (errors.length === 0) {
        const layerTags = new Set();
        for (const layer of layers) for (const tag of layer.tags ?? []) layerTags.add(tag);
        for (const note of notes) {
            const matches = (note.tags ?? []).some((tag) => layerTags.has(tag));
            if (!matches) {
                warnings.push(`Note "${note.id}" shares no tag with any layer — it won't surface anywhere.`);
            }
        }

        const noteTags = new Set();
        for (const note of notes) for (const tag of note.tags ?? []) noteTags.add(tag);
        for (const layer of layers) {
            const matches = (layer.tags ?? []).some((tag) => noteTags.has(tag));
            if (!matches) {
                warnings.push(`Layer "${layer.id}" matches no notes — clicking it will hide the layer.`);
            }
        }
    }

    const valid = errors.length === 0;
    return { valid, errors, warnings, normalized: valid ? normalizeManifest(manifest) : null };
}
