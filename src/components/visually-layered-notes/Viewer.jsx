import { useMemo, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { pageContentClassName } from '../../styles/styles.js';
import VisuallyLayeredNotesContext from './VisuallyLayeredNotesContext.js';
import { createInitialState, makeReducer } from './state.js';
import LayerStack from './LayerStack.jsx';
import LayerPanel from './LayerPanel.jsx';
import NotesPanel from './NotesPanel.jsx';
import Toolbar from './Toolbar.jsx';

const panelClass =
    'rounded-2xl border border-gray-200 bg-white/70 p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900/70';

// The interactive viewer for a single composite. It owns its own reducer state,
// derived from the manifest, so it can be driven by either a fetched manifest
// (the page) or an in-memory draft manifest (the authoring live preview).
//
// `composites` powers the optional on-page switcher; pass an empty array (the
// default) to hide it, e.g. when embedding the viewer as a preview.
// `showAuthorLink` adds a dev-only link to the authoring UI (kept off in previews).
export default function Viewer({ manifest, compositeId, composites = [], showAuthorLink = false }) {
    const reducer = useMemo(() => makeReducer(manifest), [manifest]);
    const [state, dispatch] = useReducer(reducer, manifest, createInitialState);
    const value = useMemo(() => ({ manifest, state, dispatch }), [manifest, state]);

    return (
        <VisuallyLayeredNotesContext.Provider value={value}>
            <div className={pageContentClassName}>
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
                    <header className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{manifest.name}</h1>
                            <div className="flex flex-wrap items-center gap-2">
                                {composites.length > 1 && (
                                    <nav aria-label="Composites" className="flex flex-wrap gap-1">
                                        {composites.map(({ id, label }) => {
                                            const active = id === compositeId;
                                            return (
                                                <Link
                                                    key={id}
                                                    to={`/visually-layered-notes/${id}`}
                                                    aria-current={active ? 'page' : undefined}
                                                    className={`rounded-lg px-3 py-1.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-gray-200 ${active
                                                        ? 'bg-blue-600 text-white'
                                                        : 'border border-gray-300 bg-white/70 text-gray-800 hover:bg-white dark:border-gray-600 dark:bg-gray-800/70 dark:text-gray-100 dark:hover:bg-gray-700'
                                                        }`}
                                                >
                                                    {label}
                                                </Link>
                                            );
                                        })}
                                    </nav>
                                )}
                                {showAuthorLink && (
                                    <Link
                                        to="/visually-layered-notes/author"
                                        className="rounded-lg border border-dashed border-amber-400 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-800 hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-amber-500/60 dark:bg-amber-500/10 dark:text-amber-200 dark:hover:bg-amber-500/20"
                                    >
                                        Open author ↗
                                    </Link>
                                )}
                            </div>
                        </div>
                        <Toolbar />
                    </header>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[15rem_minmax(0,1fr)_24rem]">
                        <aside className={`${panelClass} order-2 lg:order-1 lg:max-h-[75vh]`}>
                            <LayerPanel />
                        </aside>
                        <main className="order-1 lg:order-2">
                            <LayerStack />
                        </main>
                        <aside className={`${panelClass} order-3 flex min-h-112 flex-col lg:max-h-[75vh]`}>
                            <NotesPanel />
                        </aside>
                    </div>
                </div>
            </div>
        </VisuallyLayeredNotesContext.Provider>
    );
}
