import { useRef, useState } from 'react';
import useAuthoring from './useAuthoring.js';
import TagInput from './TagInput.jsx';
import { isValidId } from '../manifestSchema.js';
import * as api from './authoringApi.js';
import { fieldClass, iconButtonClass, dangerButtonClass } from './authoringStyles.js';

// One editable layer (structure). Handles its PNG upload (which triggers a
// scoped image-optimize on the server) and reports how many notes it matches
// so the author can see the tag-derived collection forming live.
export default function LayerEditorRow({ layer, suggestions, matchCount, isFirst, isLast }) {
    const { state, dispatch } = useAuthoring();
    const compositeId = state.compositeId;
    const fileRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const update = (patch) => dispatch({ type: 'UPDATE_LAYER', key: layer._key, patch });
    const idReady = isValidId(layer.id);

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
            const { image } = await api.uploadLayerImage(compositeId, layer.id, file);
            update({ image });
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        if (idReady) api.deleteLayerImage(compositeId, layer.id).catch(() => { });
        dispatch({ type: 'REMOVE_LAYER', key: layer._key });
    };

    return (
        <div className="flex flex-col gap-2 rounded-lg border border-gray-200 p-2 dark:border-gray-700">
            <div className="flex items-start gap-2">
                {layer.image ? (
                    <img
                        src={`/optimized/${layer.image}-400.png`}
                        alt=""
                        className="h-12 w-12 shrink-0 rounded border border-gray-200 object-contain dark:border-gray-700"
                        onError={(event) => {
                            event.currentTarget.style.visibility = 'hidden';
                        }}
                    />
                ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded border border-dashed border-gray-300 text-[10px] text-gray-400 dark:border-gray-600">
                        no img
                    </div>
                )}
                <div className="grid flex-1 grid-cols-2 gap-2">
                    <input
                        className={fieldClass}
                        value={layer.id}
                        onChange={(event) => update({ id: event.target.value })}
                        placeholder="id (e.g. scm)"
                        aria-label="Layer id"
                    />
                    <input
                        className={fieldClass}
                        value={layer.name}
                        onChange={(event) => update({ name: event.target.value })}
                        placeholder="Display name"
                        aria-label="Layer name"
                    />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                    order
                    <input
                        type="number"
                        className={`${fieldClass} w-20`}
                        value={layer.order}
                        onChange={(event) => update({ order: Number(event.target.value) })}
                        aria-label="Layer order"
                    />
                </label>
                <button
                    type="button"
                    className={iconButtonClass}
                    onClick={() => dispatch({ type: 'MOVE_LAYER', key: layer._key, direction: 'up' })}
                    disabled={isFirst}
                    aria-label="Move layer toward front"
                >
                    ↑
                </button>
                <button
                    type="button"
                    className={iconButtonClass}
                    onClick={() => dispatch({ type: 'MOVE_LAYER', key: layer._key, direction: 'down' })}
                    disabled={isLast}
                    aria-label="Move layer toward back"
                >
                    ↓
                </button>
                <button type="button" className={iconButtonClass} onClick={() => fileRef.current?.click()} disabled={uploading}>
                    {uploading ? 'Uploading…' : layer.image ? 'Replace PNG' : 'Upload PNG'}
                </button>
                <input ref={fileRef} type="file" accept="image/png" className="hidden" onChange={handleUpload} />
                <span
                    className={`text-xs ${matchCount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}
                    title="Notes whose tags overlap this layer"
                >
                    {matchCount > 0 ? `matches ${matchCount} note${matchCount === 1 ? '' : 's'}` : 'hides on click'}
                </span>
                <button type="button" className={`${dangerButtonClass} ml-auto`} onClick={handleRemove}>
                    Delete
                </button>
            </div>

            <TagInput tags={layer.tags} onChange={(tags) => update({ tags })} suggestions={suggestions} />
            {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}
