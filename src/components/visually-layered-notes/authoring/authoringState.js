// Draft-manifest state for the authoring UI. This mirrors the viewer's
// reducer pattern but edits a working copy of a manifest in memory; nothing
// touches disk until the page calls the write API.
//
// Draft layers/notes carry a transient `_key` for stable React keys while ids
// are being typed. `draftToManifest` strips it and derives canonical image/file
// paths from ids (the same convention the server enforces on save).
import { layerImagePath, noteFilePath } from '../manifestSchema.js';

let keySeq = 0;
function nextKey() {
    keySeq += 1;
    return `draft-${keySeq}`;
}

function withKey(obj) {
    return { _key: nextKey(), ...obj };
}

export function createInitialAuthoringState() {
    return {
        compositeId: null,
        draft: null,
        savedSnapshot: null, // JSON of the last saved manifest, for dirty checks
        status: 'idle', // idle | loading | saving
        message: null, // { type: 'error' | 'success' | 'info', text }
    };
}

export function draftFromManifest(manifest) {
    return {
        id: manifest.id,
        name: manifest.name ?? '',
        canvas: {
            width: manifest.canvas?.width ?? 1200,
            height: manifest.canvas?.height ?? 1500,
        },
        layers: (manifest.layers ?? []).map((layer) =>
            withKey({
                id: layer.id ?? '',
                name: layer.name ?? '',
                image: layer.image ?? '',
                order: Number.isInteger(layer.order) ? layer.order : 0,
                tags: [...(layer.tags ?? [])],
            }),
        ),
        notes: (manifest.notes ?? []).map((note) =>
            withKey({
                id: note.id ?? '',
                title: note.title ?? '',
                file: note.file ?? '',
                tags: [...(note.tags ?? [])],
            }),
        ),
    };
}

// Convert a draft into a manifest shape (image/file derived from ids, _key dropped).
export function draftToManifest(draft) {
    if (!draft) return null;
    return {
        id: draft.id,
        name: draft.name,
        canvas: { width: draft.canvas.width, height: draft.canvas.height },
        layers: draft.layers.map((layer) => ({
            id: layer.id,
            name: layer.name,
            image: layer.id ? layerImagePath(draft.id, layer.id) : layer.image || '',
            order: layer.order,
            tags: layer.tags,
        })),
        notes: draft.notes.map((note) => ({
            id: note.id,
            title: note.title,
            file: note.id ? noteFilePath(draft.id, note.id) : note.file || '',
            tags: note.tags,
        })),
    };
}

export function snapshot(draft) {
    return JSON.stringify(draftToManifest(draft));
}

function setDraft(state, draft) {
    return { ...state, draft };
}

export function authoringReducer(state, action) {
    switch (action.type) {
        case 'SET_STATUS':
            return { ...state, status: action.status };

        case 'SET_MESSAGE':
            return { ...state, message: action.message };

        case 'LOAD_COMPOSITE': {
            const draft = draftFromManifest(action.manifest);
            return {
                ...state,
                compositeId: action.manifest.id,
                draft,
                savedSnapshot: snapshot(draft),
                status: 'idle',
                message: null,
            };
        }

        case 'MARK_SAVED':
            return { ...state, savedSnapshot: snapshot(state.draft), status: 'idle' };

        case 'RESET_TO_SAVED':
            return state.savedSnapshot
                ? setDraft(state, draftFromManifest(JSON.parse(state.savedSnapshot)))
                : state;

        case 'SET_NAME':
            return setDraft(state, { ...state.draft, name: action.name });

        case 'SET_CANVAS':
            return setDraft(state, {
                ...state.draft,
                canvas: { ...state.draft.canvas, ...action.patch },
            });

        case 'ADD_LAYER': {
            const maxOrder = state.draft.layers.reduce((max, layer) => Math.max(max, layer.order), 0);
            const layer = withKey({ id: '', name: '', image: '', order: maxOrder + 10, tags: [] });
            return setDraft(state, { ...state.draft, layers: [layer, ...state.draft.layers] });
        }

        case 'UPDATE_LAYER':
            return setDraft(state, {
                ...state.draft,
                layers: state.draft.layers.map((layer) =>
                    layer._key === action.key ? { ...layer, ...action.patch } : layer,
                ),
            });

        case 'REMOVE_LAYER':
            return setDraft(state, {
                ...state.draft,
                layers: state.draft.layers.filter((layer) => layer._key !== action.key),
            });

        case 'MOVE_LAYER': {
            const sorted = [...state.draft.layers].sort((a, b) => b.order - a.order);
            const i = sorted.findIndex((layer) => layer._key === action.key);
            const j = action.direction === 'up' ? i - 1 : i + 1;
            if (i === -1 || j < 0 || j >= sorted.length) return state;
            const a = sorted[i];
            const b = sorted[j];
            // Distinct orders swap cleanly; equal orders get nudged so the move sticks.
            const [aOrder, bOrder] =
                a.order === b.order
                    ? action.direction === 'up'
                        ? [a.order + 1, b.order]
                        : [a.order - 1, b.order]
                    : [b.order, a.order];
            return setDraft(state, {
                ...state.draft,
                layers: state.draft.layers.map((layer) => {
                    if (layer._key === a._key) return { ...layer, order: aOrder };
                    if (layer._key === b._key) return { ...layer, order: bOrder };
                    return layer;
                }),
            });
        }

        case 'ADD_NOTE': {
            const note = withKey({ id: '', title: '', file: '', tags: [] });
            return setDraft(state, { ...state.draft, notes: [...state.draft.notes, note] });
        }

        case 'UPDATE_NOTE':
            return setDraft(state, {
                ...state.draft,
                notes: state.draft.notes.map((note) =>
                    note._key === action.key ? { ...note, ...action.patch } : note,
                ),
            });

        case 'REMOVE_NOTE':
            return setDraft(state, {
                ...state.draft,
                notes: state.draft.notes.filter((note) => note._key !== action.key),
            });

        default:
            return state;
    }
}
