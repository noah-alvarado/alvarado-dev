import { useMemo, useReducer } from 'react';
import { Link, useParams } from 'react-router-dom';
import { pageContentClassName } from '../styles/styles.js';
import ImageToNotesContext from '../components/image-to-notes/ImageToNotesContext.js';
import useComposite, { listComposites } from '../components/image-to-notes/useComposite.js';
import { createInitialState, makeReducer } from '../components/image-to-notes/state.js';
import LayerStack from '../components/image-to-notes/LayerStack.jsx';
import LayerPanel from '../components/image-to-notes/LayerPanel.jsx';
import NotesPanel from '../components/image-to-notes/NotesPanel.jsx';
import Toolbar from '../components/image-to-notes/Toolbar.jsx';

const panelClass =
    'rounded-2xl border border-gray-200 bg-white/70 p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900/70';

const composites = listComposites();

function Viewer({ manifest, compositeId }) {
    const reducer = useMemo(() => makeReducer(manifest), [manifest]);
    const [state, dispatch] = useReducer(reducer, manifest, createInitialState);
    const value = useMemo(() => ({ manifest, state, dispatch }), [manifest, state]);

    return (
        <ImageToNotesContext.Provider value={value}>
            <div className={pageContentClassName}>
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
                    <header className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{manifest.name}</h1>
                            {composites.length > 1 && (
                                <nav aria-label="Composites" className="flex flex-wrap gap-1">
                                    {composites.map(({ id, label }) => {
                                        const active = id === compositeId;
                                        return (
                                            <Link
                                                key={id}
                                                to={`/image-to-notes/${id}`}
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
        </ImageToNotesContext.Provider>
    );
}

export default function ImageToNotes() {
    const { compositeId = 'neck' } = useParams();
    const { status, manifest } = useComposite(compositeId);

    if (status === 'loading') {
        return (
            <div className={pageContentClassName}>
                <p className="text-gray-600 dark:text-gray-300">Loading…</p>
            </div>
        );
    }

    if (status === 'error' || !manifest) {
        return (
            <div className={pageContentClassName}>
                <p className="text-red-600 dark:text-red-400">Couldn’t load this composite.</p>
            </div>
        );
    }

    return <Viewer key={manifest.id} manifest={manifest} compositeId={compositeId} />;
}
