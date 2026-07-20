import { useRef, useState } from 'react';
import useAuthoring from './useAuthoring.js';
import TagInput from './TagInput.jsx';
import { isValidId } from '../manifestSchema.js';
import * as api from './authoringApi.js';
import { fieldClass, iconButtonClass, dangerButtonClass } from './authoringStyles.js';

// One editable note (PDF). Uploading writes the PDF straight into
// public/jude/<id>/notes; matching to structures is derived from tags.
export default function NoteEditorRow({ note, suggestions, matchCount }) {
    const { state, dispatch } = useAuthoring();
    const compositeId = state.compositeId;
    const fileRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const update = (patch) => dispatch({ type: 'UPDATE_NOTE', key: note._key, patch });
    const idReady = isValidId(note.id);

    const handleUpload = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        if (!idReady) {
            setError('Set a valid id before uploading.');
            return;
        }
        setUploading(true);
        setError(null);
        try {
            const { file: filePath } = await api.uploadNotePdf(compositeId, note.id, file);
            update({ file: filePath });
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        if (idReady) api.deleteNotePdf(compositeId, note.id).catch(() => { });
        dispatch({ type: 'REMOVE_NOTE', key: note._key });
    };

    return (
        <div className="flex flex-col gap-2 rounded-lg border border-gray-200 p-2 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-2">
                <input
                    className={fieldClass}
                    value={note.id}
                    onChange={(event) => update({ id: event.target.value })}
                    placeholder="id (e.g. scm-oi)"
                    aria-label="Note id"
                />
                <input
                    className={fieldClass}
                    value={note.title}
                    onChange={(event) => update({ title: event.target.value })}
                    placeholder="Title"
                    aria-label="Note title"
                />
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <button type="button" className={iconButtonClass} onClick={() => fileRef.current?.click()} disabled={uploading}>
                    {uploading ? 'Uploading…' : note.file ? 'Replace PDF' : 'Upload PDF'}
                </button>
                <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={handleUpload} />
                {note.file ? (
                    <span className="text-xs text-gray-500 dark:text-gray-400">PDF uploaded</span>
                ) : (
                    <span className="text-xs text-amber-600 dark:text-amber-400">no PDF yet</span>
                )}
                <span
                    className={`text-xs ${matchCount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}
                    title="Layers whose tags overlap this note"
                >
                    {matchCount > 0 ? `surfaces on ${matchCount} layer${matchCount === 1 ? '' : 's'}` : 'no layer match'}
                </span>
                <button type="button" className={`${dangerButtonClass} ml-auto`} onClick={handleRemove}>
                    Delete
                </button>
            </div>

            <TagInput tags={note.tags} onChange={(tags) => update({ tags })} suggestions={suggestions} />
            {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}
