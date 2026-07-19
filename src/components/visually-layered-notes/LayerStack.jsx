import { useCallback, useRef } from 'react';
import LayerImage from './LayerImage.jsx';
import usePickMap from './usePickMap.js';
import useVisuallyLayeredNotes from './useVisuallyLayeredNotes.js';

// Renders the stacked, transparent composite layers and turns pointer events into
// structure selection/hover via the offscreen pick map.
export default function LayerStack() {
    const { manifest, state, dispatch } = useVisuallyLayeredNotes();
    const containerRef = useRef(null);
    const { pick } = usePickMap({
        manifest,
        visibility: state.visibility,
        isolatedLayerId: state.isolatedLayerId,
        containerRef,
    });

    const handlePointerMove = useCallback(
        (event) => {
            dispatch({ type: 'HOVER_LAYER', layerId: pick(event.clientX, event.clientY) });
        },
        [pick, dispatch],
    );

    const handlePointerLeave = useCallback(() => {
        dispatch({ type: 'HOVER_LAYER', layerId: null });
    }, [dispatch]);

    const handlePointerDown = useCallback(
        (event) => {
            const layerId = pick(event.clientX, event.clientY);
            if (layerId) dispatch({ type: 'SELECT_LAYER', layerId });
        },
        [pick, dispatch],
    );

    const { canvas, layers } = manifest;
    const visibleLayers = layers
        .filter((layer) =>
            state.isolatedLayerId ? layer.id === state.isolatedLayerId : state.visibility[layer.id],
        )
        .sort((a, b) => a.order - b.order);
    const hoveredName = layers.find((layer) => layer.id === state.hoveredLayerId)?.name;

    return (
        <div className="relative mx-auto w-full max-w-3xl select-none">
            <div
                ref={containerRef}
                className="relative w-full overflow-hidden rounded-xl bg-white/40 dark:bg-gray-900/40"
                style={{ aspectRatio: `${canvas.width} / ${canvas.height}` }}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onPointerDown={handlePointerDown}
                role="presentation"
            >
                {visibleLayers.map((layer) => {
                    const highlighted =
                        state.showAll ||
                        state.hoveredLayerId === layer.id ||
                        state.selectedLayerId === layer.id;
                    return (
                        <div
                            key={layer.id}
                            className="pointer-events-none absolute inset-0"
                            style={{ zIndex: layer.order }}
                        >
                            <LayerImage
                                basePath={layer.image}
                                alt={layer.name}
                                className={`h-full w-full object-contain transition-[filter] duration-150 ${highlighted ? 'drop-shadow-[0_0_6px_rgba(37,99,235,0.9)]' : ''
                                    }`}
                            />
                        </div>
                    );
                })}
            </div>
            {hoveredName && (
                <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-gray-900/85 px-3 py-1 text-sm font-medium text-white shadow">
                    {hoveredName}
                </div>
            )}
        </div>
    );
}
