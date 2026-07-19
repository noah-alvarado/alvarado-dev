import useImageToNotes from './useImageToNotes.js';

const buttonClass =
    'rounded-lg border border-gray-300 dark:border-gray-600 ' +
    'bg-white/70 dark:bg-gray-800/70 px-3 py-1.5 text-sm font-semibold ' +
    'text-gray-800 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-700 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-gray-200';

export default function Toolbar() {
    const { state, dispatch } = useImageToNotes();

    return (
        <div className="flex flex-wrap items-center gap-2">
            <button type="button" className={buttonClass} onClick={() => dispatch({ type: 'RESET_ALL' })}>
                Reset
            </button>
            <button
                type="button"
                className={buttonClass}
                aria-pressed={state.showAll}
                onClick={() => dispatch({ type: 'TOGGLE_SHOW_ALL' })}
            >
                {state.showAll ? 'Hide highlights' : 'Show all'}
            </button>
            {state.isolatedLayerId && (
                <button
                    type="button"
                    className={buttonClass}
                    onClick={() => dispatch({ type: 'CLEAR_ISOLATE' })}
                >
                    Exit isolate
                </button>
            )}
        </div>
    );
}
