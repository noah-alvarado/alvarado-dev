import React from 'react';

/**
 * OptimizedImage component for responsive, modern image delivery.
 * @param {string} basePath - The path to the base image, relative to the optimized/ directory (e.g. 'noah/roscoe-bikes-headshot')
 * @param {string} alt - The alt text for the image
 * @param {object} [imgProps] - Additional props for the <img> element
 */
export default function OptimizedImage({ basePath, alt, imgProps = {}, width = '100%', height = 'auto', className = '' }) {
  const optimizedPath = `/optimized/${basePath}`;
  const srcSet = (ext) => `
    ${optimizedPath}-400.${ext} 400w,
    ${optimizedPath}-800.${ext} 800w,
    ${optimizedPath}-1200.${ext} 1200w,
    ${optimizedPath}-1920.${ext} 1920w
  `;
  const sizes = `
    (max-width: 600px) 400px,
    (max-width: 900px) 800px,
    (max-width: 1400px) 1200px,
    1920px
  `;
  return (
    <picture className={className}>
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      <source type="image/png" srcSet={srcSet('png')} sizes={sizes} />
      <img
        src={`${optimizedPath}-800.jpg`}
        srcSet={srcSet('jpg')}
        sizes={sizes}
        alt={alt}
        loading="lazy"
        style={{ width, height }}
        {...imgProps}
      />
    </picture>
  );
}
