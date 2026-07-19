import LayerRow from './LayerRow.jsx';
import useImageToNotes from './useImageToNotes.js';

export default function LayerPanel() {
    const { manifest } = useImageToNotes();
    // Top of the stack (highest order) listed first, matching what the viewer sees.
    const layers = [...manifest.layers].sort((a, b) => b.order - a.order);

    return (
        <div className="flex min-h-0 flex-col gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Structures
            </h2>
            <ul className="flex min-h-0 flex-col gap-0.5 overflow-auto">
                {layers.map((layer) => (
                    <LayerRow key={layer.id} layer={layer} />
                ))}
            </ul>
        </div>
    );
}
