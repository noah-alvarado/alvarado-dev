import { buttonClass } from './authoringStyles.js';

const messageClass = {
    error: 'text-red-600 dark:text-red-400',
    success: 'text-emerald-600 dark:text-emerald-400',
    info: 'text-gray-600 dark:text-gray-300',
};

export default function AuthoringToolbar({ isDirty, status, canSave, message, onSave, onReset, onOptimize }) {
    const saving = status === 'saving';
    return (
        <div className="flex flex-wrap items-center gap-2">
            <button type="button" className={buttonClass} onClick={onSave} disabled={!canSave || saving}>
                {saving ? 'Saving…' : 'Save manifest'}
            </button>
            <button type="button" className={buttonClass} onClick={onReset} disabled={!isDirty || saving}>
                Revert changes
            </button>
            <button type="button" className={buttonClass} onClick={onOptimize} disabled={saving}>
                Re-optimize images
            </button>
            {isDirty && <span className="text-xs text-amber-600 dark:text-amber-400">unsaved changes</span>}
            {message && <span className={`text-xs ${messageClass[message.type] ?? messageClass.info}`}>{message.text}</span>}
        </div>
    );
}
