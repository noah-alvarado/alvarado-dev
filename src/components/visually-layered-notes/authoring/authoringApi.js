// Client for the dev-only authoring write API (see tools/vln-authoring). Every
// call targets the Vite middleware mounted under /__vln-authoring, which only
// exists during `npm run dev`.

const BASE = '/__vln-authoring';

async function request(url, options) {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const message =
            data.error || (Array.isArray(data.errors) ? data.errors.join(' ') : `Request failed (${response.status})`);
        const error = new Error(message);
        error.status = response.status;
        error.data = data;
        throw error;
    }
    return data;
}

function jsonRequest(url, method, body) {
    return request(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}

function binaryRequest(url, method, file) {
    return request(url, {
        method,
        headers: { 'Content-Type': 'application/octet-stream' },
        body: file,
    });
}

export function fetchCompositesIndex() {
    return request(`${BASE}/composites`);
}

export function createComposite({ id, name, canvas }) {
    return jsonRequest(`${BASE}/composites`, 'POST', { id, name, canvas });
}

export function fetchManifest(id) {
    return request(`${BASE}/composites/${id}/manifest`);
}

export function saveManifest(id, manifest) {
    return jsonRequest(`${BASE}/composites/${id}/manifest`, 'PUT', { manifest });
}

export function uploadLayerImage(id, layerId, file) {
    return binaryRequest(`${BASE}/composites/${id}/layers/${layerId}/image`, 'POST', file);
}

export function deleteLayerImage(id, layerId) {
    return request(`${BASE}/composites/${id}/layers/${layerId}/image`, { method: 'DELETE' });
}

export function uploadNotePdf(id, noteId, file) {
    return binaryRequest(`${BASE}/composites/${id}/notes/${noteId}/pdf`, 'POST', file);
}

export function deleteNotePdf(id, noteId) {
    return request(`${BASE}/composites/${id}/notes/${noteId}/pdf`, { method: 'DELETE' });
}

export function optimizeComposite(id) {
    return request(`${BASE}/composites/${id}/optimize`, { method: 'POST' });
}
