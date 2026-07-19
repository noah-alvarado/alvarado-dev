import NotesTab from './NotesTab.jsx';
import TagSearch from './TagSearch.jsx';
import useImageToNotes from './useImageToNotes.js';

// Hosts open note collections as closable tabs plus the manual tag search.
export default function NotesPanel() {
    const { manifest, state, dispatch } = useImageToNotes();
    const active = state.openCollections.find((c) => c.key === state.activeCollectionKey) ?? null;

    const labelFor = (collection) =>
        collection.source === 'search'
            ? 'Tag search'
            : manifest.layers.find((layer) => layer.id === collection.layerId)?.name ?? 'Notes';

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Notes
            </h2>
            <TagSearch />

            {state.openCollections.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Select a structure with notes, or search by tag, to view notes here.
                </p>
            ) : (
                <>
                    <div
                        role="tablist"
                        className="flex flex-wrap gap-1 border-b border-gray-200 pb-1 dark:border-gray-700"
                    >
                        {state.openCollections.map((collection) => {
                            const isActive = collection.key === state.activeCollectionKey;
                            return (
                                <div
                                    key={collection.key}
                                    className={`flex items-center gap-1 rounded-t-md px-2 py-1 text-sm ${isActive
                                            ? 'bg-gray-200 font-semibold text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        onClick={() => dispatch({ type: 'SET_ACTIVE_COLLECTION', key: collection.key })}
                                    >
                                        {labelFor(collection)}
                                    </button>
                                    <button
                                        type="button"
                                        aria-label={`Close ${labelFor(collection)}`}
                                        className="rounded px-1 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                                        onClick={() => dispatch({ type: 'CLOSE_COLLECTION', key: collection.key })}
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    {active && <NotesTab key={active.key} collection={active} />}
                </>
            )}
        </div>
    );
}
