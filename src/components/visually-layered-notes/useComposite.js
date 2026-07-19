import { useEffect, useState } from 'react';

// Registry of available composites. New subjects are added as new
// public/jude/<id>/ folders + a manifest, with an entry here.
const registry = {
    neck: { url: '/jude/neck/manifest.json', label: 'Sample (Neck)' },
    hand: { url: '/jude/hand/manifest.json', label: 'Hand' },
};

export function resolveManifestUrl(compositeId) {
    return (registry[compositeId] ?? registry.neck).url;
}

// The list of composites for the on-page switcher, in registry order.
export function listComposites() {
    return Object.entries(registry).map(([id, entry]) => ({ id, label: entry.label }));
}

// Fetches and returns a composite manifest by id.
// Returns { status: 'loading' | 'ready' | 'error', manifest, error }.
export default function useComposite(compositeId) {
    const [result, setResult] = useState({ status: 'loading', manifest: null, error: null });

    useEffect(() => {
        let cancelled = false;
        setResult({ status: 'loading', manifest: null, error: null });

        fetch(resolveManifestUrl(compositeId))
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load composite "${compositeId}" (${response.status})`);
                }
                return response.json();
            })
            .then((manifest) => {
                if (!cancelled) setResult({ status: 'ready', manifest, error: null });
            })
            .catch((error) => {
                if (!cancelled) setResult({ status: 'error', manifest: null, error });
            });

        return () => {
            cancelled = true;
        };
    }, [compositeId]);

    return result;
}
