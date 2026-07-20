import { useState } from 'react';
import { isValidId } from '../manifestSchema.js';

const labelClass = 'text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400';
const fieldClass =
    'rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100';
const buttonClass =
    'rounded-lg border border-gray-300 bg-white/70 px-3 py-1.5 text-sm font-semibold text-gray-800 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800/70 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus-visible:ring-gray-200';

export default function CompositePicker({ composites, currentId, onSelect, onCreate, busy }) {
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState({ id: '', name: '', width: 1200, height: 1500 });

    const idTaken = composites.some((composite) => composite.id === form.id);
    const canCreate = isValidId(form.id) && !idTaken && form.width > 0 && form.height > 0;

    const submit = (event) => {
        event.preventDefault();
        if (!canCreate) return;
        onCreate({
            id: form.id,
            name: form.name.trim() || form.id,
            canvas: { width: Number(form.width), height: Number(form.height) },
        });
        setForm({ id: '', name: '', width: 1200, height: 1500 });
        setCreating(false);
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-end gap-2">
                <label className="flex flex-col gap-1">
                    <span className={labelClass}>Composite</span>
                    <select
                        className={fieldClass}
                        value={currentId ?? ''}
                        onChange={(event) => onSelect(event.target.value)}
                        disabled={busy}
                    >
                        {!currentId && <option value="">Select a composite…</option>}
                        {composites.map((composite) => (
                            <option key={composite.id} value={composite.id}>
                                {composite.label ?? composite.id}
                            </option>
                        ))}
                    </select>
                </label>
                <button type="button" className={buttonClass} onClick={() => setCreating((open) => !open)}>
                    {creating ? 'Cancel' : 'New composite'}
                </button>
            </div>

            {creating && (
                <form onSubmit={submit} className="flex flex-wrap items-end gap-2 rounded-lg border border-dashed border-gray-300 p-3 dark:border-gray-600">
                    <label className="flex flex-col gap-1">
                        <span className={labelClass}>Id</span>
                        <input
                            className={fieldClass}
                            value={form.id}
                            onChange={(event) => setForm((prev) => ({ ...prev, id: event.target.value }))}
                            placeholder="left-hand"
                            autoFocus
                        />
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className={labelClass}>Name</span>
                        <input
                            className={fieldClass}
                            value={form.name}
                            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                            placeholder="Left Hand"
                        />
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className={labelClass}>Canvas W</span>
                        <input
                            type="number"
                            min="1"
                            className={`${fieldClass} w-24`}
                            value={form.width}
                            onChange={(event) => setForm((prev) => ({ ...prev, width: event.target.value }))}
                        />
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className={labelClass}>Canvas H</span>
                        <input
                            type="number"
                            min="1"
                            className={`${fieldClass} w-24`}
                            value={form.height}
                            onChange={(event) => setForm((prev) => ({ ...prev, height: event.target.value }))}
                        />
                    </label>
                    <button type="submit" className={buttonClass} disabled={!canCreate || busy}>
                        Create
                    </button>
                    {form.id && !isValidId(form.id) && (
                        <p className="w-full text-xs text-red-600 dark:text-red-400">
                            Id must be lowercase-hyphenated (e.g. “left-hand”).
                        </p>
                    )}
                    {idTaken && (
                        <p className="w-full text-xs text-red-600 dark:text-red-400">
                            A composite with that id already exists.
                        </p>
                    )}
                </form>
            )}
        </div>
    );
}
