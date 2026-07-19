import { lazy, Suspense } from 'react';
import { collectionForLayer, collectionForTags } from './tagMatch.js';
import useImageToNotes from './useImageToNotes.js';

// Load react-pdf / pdf.js only when a document is actually shown, keeping it out
// of the main bundle.
const PdfDocument = lazy(() => import('./PdfDocument.jsx'));

const chip =
    'rounded-full px-3 py-1 text-xs font-medium ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-gray-200';

// Renders one open collection: its ranked note documents plus the active PDF.
export default function NotesTab({ collection }) {
    const { manifest, state, dispatch } = useImageToNotes();
    const notes =
        collection.source === 'layer'
            ? collectionForLayer(manifest, collection.layerId)
            : collectionForTags(manifest, state.tagSearch.selectedTags);
    const activeNote = notes.find((note) => note.id === collection.activeNoteId) ?? notes[0] ?? null;

    if (notes.length === 0) {
        return <p className="p-3 text-sm text-gray-500 dark:text-gray-400">No matching notes.</p>;
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-2">
            <div className="flex flex-wrap gap-1.5">
                {notes.map((note) => {
                    const active = note.id === activeNote?.id;
                    return (
                        <button
                            key={note.id}
                            type="button"
                            onClick={() =>
                                dispatch({ type: 'SET_ACTIVE_NOTE', key: collection.key, noteId: note.id })
                            }
                            className={`${chip} ${active
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'
                                }`}
                        >
                            {note.title}
                        </button>
                    );
                })}
            </div>
            <div className="min-h-0 flex-1 overflow-auto rounded-lg bg-gray-100 p-2 dark:bg-gray-900/60">
                {activeNote && (
                    <Suspense
                        fallback={<p className="p-4 text-sm text-gray-500 dark:text-gray-400">Loading viewer…</p>}
                    >
                        <PdfDocument file={activeNote.file} />
                    </Suspense>
                )}
            </div>
        </div>
    );
}
