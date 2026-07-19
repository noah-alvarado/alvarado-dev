import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Bundle the pdf.js worker via Vite (ESM URL). Configured once at module load.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export default function PdfDocument({ file }) {
    const containerRef = useRef(null);
    const [numPages, setNumPages] = useState(0);
    const [width, setWidth] = useState(0);

    // Render pages at the container's width so notes fit the panel on any device.
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return undefined;
        const update = () => setWidth(el.clientWidth);
        update();
        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="w-full">
            <Document
                file={file}
                onLoadSuccess={({ numPages: loaded }) => setNumPages(loaded)}
                loading={<p className="p-4 text-sm text-gray-500 dark:text-gray-400">Loading notes…</p>}
                error={<p className="p-4 text-sm text-red-600 dark:text-red-400">Could not load this PDF.</p>}
                className="flex flex-col items-center gap-3"
            >
                {width > 0 &&
                    Array.from({ length: numPages }, (_, index) => (
                        <Page
                            key={index}
                            pageNumber={index + 1}
                            width={width}
                            className="overflow-hidden rounded shadow"
                        />
                    ))}
            </Document>
        </div>
    );
}
