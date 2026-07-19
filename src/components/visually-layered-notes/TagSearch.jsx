import useVisuallyLayeredNotes from './useVisuallyLayeredNotes.js';

const chip =
    'rounded-full px-2.5 py-1 text-xs font-medium ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-gray-200';

// Manual tag search: pick from the composite's known tags; results are ranked by
// overlap (union / ANY), matching the structure-derived collection behavior.
export default function TagSearch() {
    const { manifest, state, dispatch } = useVisuallyLayeredNotes();
    const selected = state.tagSearch.selectedTags;

    const toggle = (tag) => {
        const next = selected.includes(tag)
            ? selected.filter((value) => value !== tag)
            : [...selected, tag];
        dispatch({ type: 'SET_TAG_SEARCH', selectedTags: next });
    };

    return (
        <details className="w-full rounded-lg border border-gray-200 p-2 dark:border-gray-700">
            <summary className="cursor-pointer text-sm font-semibold text-gray-800 dark:text-gray-100">
                Search notes by tag
            </summary>
            <div className="mt-2 flex flex-wrap gap-1.5">
                {manifest.tags.map((tag) => {
                    const active = selected.includes(tag);
                    return (
                        <button
                            key={tag}
                            type="button"
                            aria-pressed={active}
                            onClick={() => toggle(tag)}
                            className={`${chip} ${active
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {tag}
                        </button>
                    );
                })}
            </div>
        </details>
    );
}
