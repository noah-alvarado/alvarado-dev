import { useMemo } from 'react';
import useAuthoring from './useAuthoring.js';
import LayerEditorRow from './LayerEditorRow.jsx';
import { draftToManifest } from './authoringState.js';
import { deriveTags } from '../manifestSchema.js';
import { collectionForLayer } from '../tagMatch.js';
import { buttonClass, cardClass, sectionTitleClass } from './authoringStyles.js';

export default function LayerEditor() {
    const { state, dispatch } = useAuthoring();
    const { draft } = state;

    const suggestions = useMemo(() => deriveTags(draft.layers, draft.notes), [draft.layers, draft.notes]);
    const previewManifest = useMemo(() => draftToManifest(draft), [draft]);

    // Displayed back-to-front (highest order first), matching the viewer panel.
    const ordered = useMemo(() => [...draft.layers].sort((a, b) => b.order - a.order), [draft.layers]);

    return (
        <section className={cardClass}>
            <div className="mb-2 flex items-center justify-between">
                <h2 className={sectionTitleClass}>Layers ({draft.layers.length})</h2>
                <button type="button" className={buttonClass} onClick={() => dispatch({ type: 'ADD_LAYER' })}>
                    Add layer
                </button>
            </div>
            {ordered.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    No layers yet. Add one, give it an id, and upload its transparent PNG.
                </p>
            ) : (
                <div className="flex flex-col gap-2">
                    {ordered.map((layer, index) => (
                        <LayerEditorRow
                            key={layer._key}
                            layer={layer}
                            suggestions={suggestions}
                            matchCount={layer.id ? collectionForLayer(previewManifest, layer.id).length : 0}
                            isFirst={index === 0}
                            isLast={index === ordered.length - 1}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
