import { useEffect, useMemo, useState } from 'react';
import useAuthoring from './useAuthoring.js';
import Viewer from '../Viewer.jsx';
import { draftToManifest } from './authoringState.js';
import { deriveTags } from '../manifestSchema.js';
import { cardClass, sectionTitleClass } from './authoringStyles.js';

function useDebounced(value, delay) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

// Embeds the real viewer, driven by an in-memory draft manifest, so the author
// sees stacking, hit-testing, and tag-derived note collections exactly as
// visitors will. Only layers with an uploaded image are stacked (no broken art),
// while tags still drive the derived collections.
export default function LivePreview() {
    const { state } = useAuthoring();
    const debouncedDraft = useDebounced(state.draft, 250);

    const manifest = useMemo(() => {
        const base = draftToManifest(debouncedDraft);
        const layers = base.layers.filter((layer) => layer.id && layer.image);
        return { ...base, layers, tags: deriveTags(base.layers, base.notes) };
    }, [debouncedDraft]);

    // Remount only when structural identity changes (layers/notes added, removed,
    // or renamed). Order, tag, and name edits reflect live without a reset.
    const signature = useMemo(() => {
        const layerIds = manifest.layers.map((layer) => layer.id).sort();
        const noteIds = manifest.notes.map((note) => note.id).sort();
        return JSON.stringify({ layerIds, noteIds, w: manifest.canvas.width, h: manifest.canvas.height });
    }, [manifest]);

    const ready = manifest.id && manifest.canvas.width > 0 && manifest.canvas.height > 0;
    const hasArt = manifest.layers.length > 0;

    return (
        <section className={cardClass}>
            <h2 className={`${sectionTitleClass} mb-2`}>Live preview</h2>
            {ready && hasArt ? (
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    <Viewer key={signature} manifest={manifest} compositeId={manifest.id} />
                </div>
            ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Upload at least one layer PNG to preview the composite.
                </p>
            )}
        </section>
    );
}
