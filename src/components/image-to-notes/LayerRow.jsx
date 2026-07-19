import { collectionForLayer } from './tagMatch.js';
import useImageToNotes from './useImageToNotes.js';

const iconButton =
    'flex h-7 w-7 items-center justify-center rounded-md text-sm ' +
    'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 ' +
    'disabled:opacity-40 disabled:hover:bg-transparent ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-gray-200';

export default function LayerRow({ layer }) {
    const { manifest, state, dispatch } = useImageToNotes();
    const layerHasNotes = collectionForLayer(manifest, layer.id).length > 0;
    const isolated = state.isolatedLayerId === layer.id;
    const isolating = Boolean(state.isolatedLayerId);
    const visible = isolating ? isolated : state.visibility[layer.id];
    const selected = state.selectedLayerId === layer.id;

    const setVisible = (value) =>
        dispatch({ type: 'SET_LAYER_VISIBLE', layerId: layer.id, visible: value });

    const handleName = () => {
        if (layerHasNotes) dispatch({ type: 'OPEN_NOTES', layerId: layer.id });
        else setVisible(!visible);
    };

    const handleIsolate = () =>
        dispatch(isolated ? { type: 'CLEAR_ISOLATE' } : { type: 'ISOLATE_LAYER', layerId: layer.id });

    return (
        <li
            className={`flex items-center gap-1.5 rounded-md px-1.5 py-1 ${selected ? 'bg-blue-100 dark:bg-blue-900/40' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            onMouseEnter={() => dispatch({ type: 'HOVER_LAYER', layerId: layer.id })}
            onMouseLeave={() => dispatch({ type: 'HOVER_LAYER', layerId: null })}
        >
            <span
                className={`h-2 w-2 flex-shrink-0 rounded-full ${layerHasNotes ? 'bg-blue-500' : 'bg-transparent'}`}
                aria-hidden="true"
            />
            <button
                type="button"
                title={layer.name}
                onClick={handleName}
                className="flex-1 truncate rounded px-1 text-left text-sm text-gray-900 dark:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-gray-200"
            >
                {layer.name}
            </button>

            {layerHasNotes && (
                <button
                    type="button"
                    className={iconButton}
                    aria-label={`Open notes for ${layer.name}`}
                    onClick={() => dispatch({ type: 'OPEN_NOTES', layerId: layer.id })}
                >
                    📄
                </button>
            )}

            <button
                type="button"
                className={iconButton}
                aria-pressed={isolated}
                aria-label={isolated ? `Stop isolating ${layer.name}` : `Isolate ${layer.name}`}
                onClick={handleIsolate}
            >
                {isolated ? '◉' : '◎'}
            </button>

            <button
                type="button"
                className={iconButton}
                aria-pressed={visible}
                aria-label={`${visible ? 'Hide' : 'Show'} ${layer.name}`}
                onClick={() => setVisible(!visible)}
                disabled={isolating && !isolated}
            >
                {visible ? '👁' : '🙈'}
            </button>
        </li>
    );
}
