import React, { useState } from "react";
import OptimizedImage from './OptimizedImage.jsx';
import { convertRemToPixels } from "../styles/styles.js";

function spanToClasses(span) {
  let classes = '';

  if (span.x === 1) classes += 'col-span-1 ';
  else if (span.x === 2) classes += 'col-span-2 ';

  if (span.y === 1) classes += 'row-span-1 ';
  else if (span.y === 2) classes += 'row-span-2 ';

  return classes.trim();
}

function photoToGridItem({ src, alt, span: { x, y } }, i) {
  return (
    <div key={i} className={spanToClasses({ x, y })}>
      <OptimizedImage
        basePath={src}
        alt={alt}
        className="block w-full h-full"
        width="100%"
        height="100%"
        imgProps={{
          className: "rounded-lg",
          loading: "lazy",
        }}
      />
    </div>
  );
}

export default function PhotoGrid({ photos }) {
  const [showMorePhotos, setShowMorePhotos] = useState(window.innerWidth >= convertRemToPixels(48));

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {photos.slice(0, showMorePhotos ? photos.length : 8).map(photoToGridItem)}
      </div>
      <button
        onClick={() => setShowMorePhotos(!showMorePhotos)}
        className="mt-2 cursor-pointer font-semibold shadow-md hover:shadow-lg transition-all duration-200 bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-white/80 dark:hover:bg-gray-700/80"
      >
        {showMorePhotos ? "Show Less" : "Show More"}
      </button></>
  );
}
