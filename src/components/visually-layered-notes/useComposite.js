import { useEffect, useState } from 'react';

// Composites are data-driven: the switcher list comes from a runtime index
// (public/jude/composites.json) and each manifest lives at a predictable path,
// so adding a subject needs no code changes.

const COMPOSITES_INDEX_URL = '/jude/composites.json';
export const DEFAULT_COMPOSITE_ID = 'neck';

// Fallback if the index can't be fetched, so the viewer keeps working.
const FALLBACK_COMPOSITES = [
    { id: 'neck', label: 'Sample (Neck)' },
    { id: 'hand', label: 'Hand' },
];

export function resolveManifestUrl(compositeId) {
    const id = compositeId || DEFAULT_COMPOSITE_ID;
    return `/jude/${id}/manifest.json`;
}

// Fetch the composites index ({ id, label } entries, in index order).
export async function fetchComposites() {
    try {
        const response = await fetch(COMPOSITES_INDEX_URL);
        if (!response.ok) throw new Error(`Failed to load composites index (${response.status})`);
        const data = await response.json();
        const composites = Array.isArray(data?.composites) ? data.composites : [];
        return composites.filter((entry) => entry && typeof entry.id === 'string');
    } catch {
        return FALLBACK_COMPOSITES;
    }
}

// Hook form for the on-page switcher. Returns { status, composites }.
export function useComposites() {
    const [state, setState] = useState({ status: 'loading', composites: [] });

    useEffect(() => {
        let cancelled = false;
        fetchComposites().then((composites) => {
            if (!cancelled) setState({ status: 'ready', composites });
        });
        return () => {
            cancelled = true;
        };
    }, []);

    return state;
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
