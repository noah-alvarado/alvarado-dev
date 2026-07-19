// Pure tag-matching and ranking helpers for the Image-to-Notes viewer.
// Notes are associated to structures indirectly: a note belongs to a structure's
// collection when their tag sets overlap, ranked by the number of shared tags.

function intersectionCount(a = [], b = []) {
    const setB = new Set(b);
    let count = 0;
    for (const tag of a) {
        if (setB.has(tag)) count += 1;
    }
    return count;
}

function getLayer(manifest, layerId) {
    return manifest?.layers?.find((layer) => layer.id === layerId) ?? null;
}

// Rank a manifest's notes by tag overlap with the given tag set (descending).
// Ties break by the note's original manifest order, then title.
function rankNotes(manifest, tags) {
    const order = new Map(manifest.notes.map((note, index) => [note.id, index]));
    return manifest.notes
        .map((note) => ({ note, score: intersectionCount(tags, note.tags) }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            const orderDiff = order.get(a.note.id) - order.get(b.note.id);
            if (orderDiff !== 0) return orderDiff;
            return a.note.title.localeCompare(b.note.title);
        })
        .map((entry) => entry.note);
}

export function collectionForLayer(manifest, layerId) {
    const layer = getLayer(manifest, layerId);
    if (!layer) return [];
    return rankNotes(manifest, layer.tags ?? []);
}

export function hasNotes(manifest, layerId) {
    return collectionForLayer(manifest, layerId).length > 0;
}

export function collectionForTags(manifest, selectedTags) {
    if (!selectedTags || selectedTags.length === 0) return [];
    return rankNotes(manifest, selectedTags);
}
