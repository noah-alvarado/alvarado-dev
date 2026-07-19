import { useCallback, useEffect, useRef, useState } from 'react';

// Builds an offscreen "pick map" — a low-resolution index buffer where each pixel
// holds the topmost visible structure at that point — so pointer events on the
// stacked, transparent layer images can be resolved to a single structure.
//
// The map is rebuilt only when visibility/isolation changes; per-event lookup is
// a single-pixel read. Layer images are same-origin, so the canvas is untainted.

const PICK_MAX = 900;
const ALPHA_THRESHOLD = 16;

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

export default function usePickMap({ manifest, visibility, isolatedLayerId, containerRef }) {
    const imagesRef = useRef(new Map());
    const indexRef = useRef(null);
    const [ready, setReady] = useState(false);

    const canvas = manifest?.canvas ?? { width: 1, height: 1 };
    const pickWidth = Math.min(PICK_MAX, canvas.width);
    const pickHeight = Math.max(1, Math.round((pickWidth * canvas.height) / canvas.width));

    // Preload each layer's alpha (png) once per manifest.
    useEffect(() => {
        let cancelled = false;
        setReady(false);
        const layers = manifest?.layers ?? [];
        Promise.all(
            layers.map(async (layer) => {
                try {
                    return [layer.id, await loadImage(`/optimized/${layer.image}-800.png`)];
                } catch {
                    return [layer.id, null];
                }
            }),
        ).then((pairs) => {
            if (cancelled) return;
            imagesRef.current = new Map(pairs);
            setReady(true);
        });
        return () => {
            cancelled = true;
        };
    }, [manifest]);

    const rebuild = useCallback(() => {
        if (!ready || !manifest) return;
        const scratch = document.createElement('canvas');
        scratch.width = pickWidth;
        scratch.height = pickHeight;
        const ctx = scratch.getContext('2d', { willReadFrequently: true });
        const data = new Int32Array(pickWidth * pickHeight).fill(-1);

        // Bottom -> top so higher layers overwrite lower ones (topmost wins).
        const visibleLayers = manifest.layers
            .filter((layer) => (isolatedLayerId ? layer.id === isolatedLayerId : visibility[layer.id]))
            .sort((a, b) => a.order - b.order);

        visibleLayers.forEach((layer, layerIndex) => {
            const img = imagesRef.current.get(layer.id);
            if (!img) return;
            ctx.clearRect(0, 0, pickWidth, pickHeight);
            ctx.drawImage(img, 0, 0, pickWidth, pickHeight);
            const pixels = ctx.getImageData(0, 0, pickWidth, pickHeight).data;
            for (let i = 0; i < data.length; i += 1) {
                if (pixels[i * 4 + 3] > ALPHA_THRESHOLD) data[i] = layerIndex;
            }
        });

        indexRef.current = {
            width: pickWidth,
            height: pickHeight,
            data,
            layerIds: visibleLayers.map((layer) => layer.id),
        };
    }, [ready, manifest, visibility, isolatedLayerId, pickWidth, pickHeight]);

    useEffect(() => {
        rebuild();
    }, [rebuild]);

    const pick = useCallback(
        (clientX, clientY) => {
            const index = indexRef.current;
            const el = containerRef.current;
            if (!index || !el) return null;
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return null;
            const relX = (clientX - rect.left) / rect.width;
            const relY = (clientY - rect.top) / rect.height;
            if (relX < 0 || relX > 1 || relY < 0 || relY > 1) return null;
            const px = Math.min(index.width - 1, Math.floor(relX * index.width));
            const py = Math.min(index.height - 1, Math.floor(relY * index.height));
            const layerIndex = index.data[py * index.width + px];
            return layerIndex < 0 ? null : index.layerIds[layerIndex] ?? null;
        },
        [containerRef],
    );

    return { pick, ready };
}
