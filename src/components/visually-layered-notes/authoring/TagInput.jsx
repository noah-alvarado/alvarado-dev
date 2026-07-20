import { useId, useMemo, useState } from 'react';

// A compact tag editor: removable chips plus an input that adds tags on Enter
// or comma. Suggestions (the composite's derived vocabulary) surface through a
// datalist so existing tags are easy to reuse and keep spelling consistent.

const chipClass =
    'inline-flex items-center gap-1 rounded-full bg-blue-600/10 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-400/15 dark:text-blue-200';
const inputClass =
    'w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100';

function normalizeTag(raw) {
    return raw
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
}

export default function TagInput({ tags, onChange, suggestions = [] }) {
    const [value, setValue] = useState('');
    const listId = useId();

    const available = useMemo(
        () => suggestions.filter((tag) => !tags.includes(tag)).sort(),
        [suggestions, tags],
    );

    const addTag = (raw) => {
        const tag = normalizeTag(raw);
        if (tag && !tags.includes(tag)) onChange([...tags, tag]);
        setValue('');
    };

    const removeTag = (tag) => onChange(tags.filter((existing) => existing !== tag));

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            addTag(value);
        } else if (event.key === 'Backspace' && value === '' && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    };

    return (
        <div className="flex flex-col gap-1">
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {tags.map((tag) => (
                        <span key={tag} className={chipClass}>
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                aria-label={`Remove tag ${tag}`}
                                className="text-blue-700/70 hover:text-blue-900 dark:text-blue-200/70 dark:hover:text-blue-100"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}
            <input
                list={listId}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => value && addTag(value)}
                placeholder="Add tag…"
                className={inputClass}
            />
            <datalist id={listId}>
                {available.map((tag) => (
                    <option key={tag} value={tag} />
                ))}
            </datalist>
        </div>
    );
}
