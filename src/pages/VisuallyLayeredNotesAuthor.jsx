import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import { pageContentClassName } from '../styles/styles.js';
import AuthoringContext from '../components/visually-layered-notes/authoring/AuthoringContext.js';
import {
    authoringReducer,
    createInitialAuthoringState,
    draftToManifest,
    snapshot,
} from '../components/visually-layered-notes/authoring/authoringState.js';
import * as api from '../components/visually-layered-notes/authoring/authoringApi.js';
import { validateManifest } from '../components/visually-layered-notes/manifestSchema.js';
import CompositePicker from '../components/visually-layered-notes/authoring/CompositePicker.jsx';
import LayerEditor from '../components/visually-layered-notes/authoring/LayerEditor.jsx';
import NoteEditor from '../components/visually-layered-notes/authoring/NoteEditor.jsx';
import ManifestPreview from '../components/visually-layered-notes/authoring/ManifestPreview.jsx';
import LivePreview from '../components/visually-layered-notes/authoring/LivePreview.jsx';
import AuthoringToolbar from '../components/visually-layered-notes/authoring/AuthoringToolbar.jsx';
import { buttonClass, fieldClass, labelClass } from '../components/visually-layered-notes/authoring/authoringStyles.js';

const EMPTY_VALIDATION = { valid: false, errors: [], warnings: [], normalized: null };

export default function VisuallyLayeredNotesAuthor() {
    const [state, dispatch] = useReducer(authoringReducer, undefined, createInitialAuthoringState);
    const [composites, setComposites] = useState([]);
    const [busy, setBusy] = useState(false);

    const setMessage = useCallback((type, text) => {
        dispatch({ type: 'SET_MESSAGE', message: { type, text } });
    }, []);

    const loadComposite = useCallback(
        async (id) => {
            if (!id) return;
            dispatch({ type: 'SET_STATUS', status: 'loading' });
            try {
                const { manifest } = await api.fetchManifest(id);
                dispatch({ type: 'LOAD_COMPOSITE', manifest });
            } catch (err) {
                setMessage('error', err.message);
                dispatch({ type: 'SET_STATUS', status: 'idle' });
            }
        },
        [setMessage],
    );

    // Load the composites index once, and open the first composite if any exist.
    useEffect(() => {
        let cancelled = false;
        api.fetchCompositesIndex()
            .then(({ composites: list }) => {
                if (cancelled) return;
                setComposites(list);
                if (list.length > 0) loadComposite(list[0].id);
            })
            .catch((err) => setMessage('error', err.message));
        return () => {
            cancelled = true;
        };
    }, [loadComposite, setMessage]);

    const handleCreate = useCallback(
        async ({ id, name, canvas }) => {
            setBusy(true);
            try {
                const { manifest, composites: updated } = await api.createComposite({ id, name, canvas });
                setComposites(updated);
                dispatch({ type: 'LOAD_COMPOSITE', manifest });
                setMessage('success', `Created "${id}".`);
            } catch (err) {
                setMessage('error', err.message);
            } finally {
                setBusy(false);
            }
        },
        [setMessage],
    );

    const previewManifest = useMemo(() => draftToManifest(state.draft), [state.draft]);
    const validation = useMemo(
        () => (previewManifest ? validateManifest(previewManifest) : EMPTY_VALIDATION),
        [previewManifest],
    );

    const assetWarnings = useMemo(() => {
        if (!state.draft) return [];
        const warnings = [];
        for (const layer of state.draft.layers) {
            if (layer.id && !layer.image) warnings.push(`Layer "${layer.id}" has no uploaded PNG yet.`);
        }
        for (const note of state.draft.notes) {
            if (note.id && !note.file) warnings.push(`Note "${note.id}" has no uploaded PDF yet.`);
        }
        return warnings;
    }, [state.draft]);

    const isDirty = useMemo(
        () => Boolean(state.draft) && snapshot(state.draft) !== state.savedSnapshot,
        [state.draft, state.savedSnapshot],
    );

    const handleSave = useCallback(async () => {
        if (!validation.valid) {
            setMessage('error', 'Fix validation errors before saving.');
            return;
        }
        dispatch({ type: 'SET_STATUS', status: 'saving' });
        try {
            const { manifest, composites: updated } = await api.saveManifest(state.compositeId, previewManifest);
            setComposites(updated);
            dispatch({ type: 'LOAD_COMPOSITE', manifest });
            setMessage('success', 'Saved.');
        } catch (err) {
            dispatch({ type: 'SET_STATUS', status: 'idle' });
            setMessage('error', err.message);
        }
    }, [validation.valid, state.compositeId, previewManifest, setMessage]);

    const handleOptimize = useCallback(async () => {
        dispatch({ type: 'SET_STATUS', status: 'saving' });
        try {
            await api.optimizeComposite(state.compositeId);
            setMessage('success', 'Images re-optimized.');
        } catch (err) {
            setMessage('error', err.message);
        } finally {
            dispatch({ type: 'SET_STATUS', status: 'idle' });
        }
    }, [state.compositeId, setMessage]);

    const contextValue = useMemo(() => ({ state, dispatch }), [state]);

    return (
        <div className={pageContentClassName}>
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
                <header className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Visually Layered Notes — Authoring
                        </h1>
                        <Link
                            to={state.compositeId ? `/visually-layered-notes/${state.compositeId}` : '/visually-layered-notes'}
                            className={buttonClass}
                        >
                            ← Back to viewer
                        </Link>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Local dev tool. Edits write straight to your repo (src/assets, public/jude) and are never part
                        of the production build.
                    </p>
                </header>

                <CompositePicker
                    composites={composites}
                    currentId={state.compositeId}
                    onSelect={loadComposite}
                    onCreate={handleCreate}
                    busy={busy || state.status === 'loading'}
                />

                {!state.draft ? (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        {state.status === 'loading' ? 'Loading…' : 'Select or create a composite to begin.'}
                    </p>
                ) : (
                    <AuthoringContext.Provider value={contextValue}>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap items-end gap-3">
                                <label className="flex flex-col gap-1">
                                    <span className={labelClass}>Composite name</span>
                                    <input
                                        className={fieldClass}
                                        value={state.draft.name}
                                        onChange={(event) => dispatch({ type: 'SET_NAME', name: event.target.value })}
                                    />
                                </label>
                                <label className="flex flex-col gap-1">
                                    <span className={labelClass}>Canvas W</span>
                                    <input
                                        type="number"
                                        min="1"
                                        className={`${fieldClass} w-24`}
                                        value={state.draft.canvas.width}
                                        onChange={(event) =>
                                            dispatch({ type: 'SET_CANVAS', patch: { width: Number(event.target.value) } })
                                        }
                                    />
                                </label>
                                <label className="flex flex-col gap-1">
                                    <span className={labelClass}>Canvas H</span>
                                    <input
                                        type="number"
                                        min="1"
                                        className={`${fieldClass} w-24`}
                                        value={state.draft.canvas.height}
                                        onChange={(event) =>
                                            dispatch({ type: 'SET_CANVAS', patch: { height: Number(event.target.value) } })
                                        }
                                    />
                                </label>
                            </div>

                            <AuthoringToolbar
                                isDirty={isDirty}
                                status={state.status}
                                canSave={validation.valid}
                                message={state.message}
                                onSave={handleSave}
                                onReset={() => dispatch({ type: 'RESET_TO_SAVED' })}
                                onOptimize={handleOptimize}
                            />

                            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
                                <div className="flex flex-col gap-4">
                                    <LayerEditor />
                                    <NoteEditor />
                                    <ManifestPreview
                                        validation={validation}
                                        assetWarnings={assetWarnings}
                                        manifest={previewManifest}
                                    />
                                </div>
                                <LivePreview />
                            </div>
                        </div>
                    </AuthoringContext.Provider>
                )}
            </div>
        </div>
    );
}
