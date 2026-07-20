import { useMemo } from 'react';
import useAuthoring from './useAuthoring.js';
import NoteEditorRow from './NoteEditorRow.jsx';
import { deriveTags } from '../manifestSchema.js';
import { buttonClass, cardClass, sectionTitleClass } from './authoringStyles.js';

// Count how many layers a note would surface on (tag overlap, either direction).
function layersMatchingNote(note, layers) {
    const noteTags = new Set(note.tags ?? []);
    return layers.filter((layer) => (layer.tags ?? []).some((tag) => noteTags.has(tag))).length;
}

export default function NoteEditor() {
    const { state, dispatch } = useAuthoring();
    const { draft } = state;

    const suggestions = useMemo(() => deriveTags(draft.layers, draft.notes), [draft.layers, draft.notes]);

    return (
        <section className={cardClass}>
            <div className="mb-2 flex items-center justify-between">
                <h2 className={sectionTitleClass}>Notes ({draft.notes.length})</h2>
                <button type="button" className={buttonClass} onClick={() => dispatch({ type: 'ADD_NOTE' })}>
                    Add note
                </button>
            </div>
            {draft.notes.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    No notes yet. Add one, give it an id, upload its PDF, and tag it to match layers.
                </p>
            ) : (
                <div className="flex flex-col gap-2">
                    {draft.notes.map((note) => (
                        <NoteEditorRow
                            key={note._key}
                            note={note}
                            suggestions={suggestions}
                            matchCount={layersMatchingNote(note, draft.layers)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
