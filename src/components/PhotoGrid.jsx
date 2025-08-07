import React from "react";
import OptimizedImage from './OptimizedImage.jsx';

export default function PhotoGrid({ photos }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {photos.map(({ src, alt, span: { x, y } }, i) => (
        <div key={i} className={`col-span-${x} row-span-${y}`}>
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
      ))}
    </div>
  );
}
