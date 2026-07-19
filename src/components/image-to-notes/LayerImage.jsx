// A single composite layer rendered from the optimized image pipeline.
// Unlike the shared OptimizedImage, this only uses alpha-preserving formats
// (webp/png) so transparent layers stack correctly — no jpg fallback.

const SIZES = [400, 800, 1200, 1920];
const sizesAttr = '(width <= 600px) 400px, (width <= 900px) 800px, (width <= 1200px) 1200px, 1920px';

function srcSet(basePath, ext) {
    return SIZES.map((w) => `/optimized/${basePath}-${w}.${ext} ${w}w`).join(', ');
}

export default function LayerImage({ basePath, alt, className = '', style }) {
    return (
        <picture style={{ display: 'contents' }}>
            <source type="image/webp" srcSet={srcSet(basePath, 'webp')} sizes={sizesAttr} />
            <source type="image/png" srcSet={srcSet(basePath, 'png')} sizes={sizesAttr} />
            <img
                src={`/optimized/${basePath}-1200.png`}
                srcSet={srcSet(basePath, 'png')}
                sizes={sizesAttr}
                alt={alt}
                className={className}
                style={style}
                draggable={false}
            />
        </picture>
    );
}
