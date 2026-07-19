// Page-scoped state for the Visually Layered Notes viewer: layer visibility, isolation,
// hover/selection, open note collections (tabs), and manual tag search.
import { collectionForLayer, collectionForTags, hasNotes } from './tagMatch.js';

export function createInitialState(manifest) {
    const visibility = {};
    for (const layer of manifest.layers) {
        visibility[layer.id] = true;
    }
    return {
        visibility,
        isolatedLayerId: null,
        hoveredLayerId: null,
        selectedLayerId: null,
        showAll: false,
        openCollections: [],
        activeCollectionKey: null,
        tagSearch: { selectedTags: [] },
    };
}

function openLayerCollection(state, manifest, layerId) {
    const key = `layer:${layerId}`;
    const notes = collectionForLayer(manifest, layerId);
    if (notes.length === 0) return state;
    if (state.openCollections.some((c) => c.key === key)) {
        return { ...state, selectedLayerId: layerId, activeCollectionKey: key };
    }
    return {
        ...state,
        selectedLayerId: layerId,
        openCollections: [
            ...state.openCollections,
            { key, source: 'layer', layerId, activeNoteId: notes[0].id },
        ],
        activeCollectionKey: key,
    };
}

function openSearchCollection(state, manifest) {
    const key = 'search';
    const notes = collectionForTags(manifest, state.tagSearch.selectedTags);
    const firstId = notes[0]?.id ?? null;
    if (state.openCollections.some((c) => c.key === key)) {
        return {
            ...state,
            activeCollectionKey: key,
            openCollections: state.openCollections.map((c) => {
                if (c.key !== key) return c;
                const stillValid = notes.some((n) => n.id === c.activeNoteId);
                return { ...c, activeNoteId: stillValid ? c.activeNoteId : firstId };
            }),
        };
    }
    return {
        ...state,
        openCollections: [...state.openCollections, { key, source: 'search', activeNoteId: firstId }],
        activeCollectionKey: key,
    };
}

export function makeReducer(manifest) {
    return function reducer(state, action) {
        switch (action.type) {
            case 'HOVER_LAYER':
                return state.hoveredLayerId === action.layerId
                    ? state
                    : { ...state, hoveredLayerId: action.layerId };

            case 'SET_LAYER_VISIBLE':
                return {
                    ...state,
                    visibility: { ...state.visibility, [action.layerId]: action.visible },
                };

            case 'ISOLATE_LAYER':
                return { ...state, isolatedLayerId: action.layerId };

            case 'CLEAR_ISOLATE':
                return { ...state, isolatedLayerId: null };

            // On-image (or panel name) selection: notes take priority when present,
            // otherwise the structure hides to reveal what is behind it.
            case 'SELECT_LAYER':
                if (hasNotes(manifest, action.layerId)) {
                    return openLayerCollection(state, manifest, action.layerId);
                }
                return {
                    ...state,
                    selectedLayerId: null,
                    visibility: { ...state.visibility, [action.layerId]: false },
                    isolatedLayerId:
                        state.isolatedLayerId === action.layerId ? null : state.isolatedLayerId,
                };

            case 'OPEN_NOTES':
                return openLayerCollection(state, manifest, action.layerId);

            case 'CLOSE_COLLECTION': {
                const openCollections = state.openCollections.filter((c) => c.key !== action.key);
                const activeCollectionKey =
                    state.activeCollectionKey === action.key
                        ? openCollections[openCollections.length - 1]?.key ?? null
                        : state.activeCollectionKey;
                return { ...state, openCollections, activeCollectionKey };
            }

            case 'SET_ACTIVE_COLLECTION':
                return { ...state, activeCollectionKey: action.key };

            case 'SET_ACTIVE_NOTE':
                return {
                    ...state,
                    openCollections: state.openCollections.map((c) =>
                        c.key === action.key ? { ...c, activeNoteId: action.noteId } : c,
                    ),
                };

            case 'TOGGLE_SHOW_ALL':
                return { ...state, showAll: !state.showAll };

            case 'SET_TAG_SEARCH': {
                const next = {
                    ...state,
                    tagSearch: { ...state.tagSearch, selectedTags: action.selectedTags },
                };
                if (action.selectedTags.length === 0) return next;
                return openSearchCollection(next, manifest);
            }

            case 'RESET_ALL':
                return createInitialState(manifest);

            default:
                return state;
        }
    };
}
