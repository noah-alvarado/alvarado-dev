import OptimizedImage from './OptimizedImage.jsx';
import { convertRemToPixels } from "../styles/styles.js";
import Cupboard from "./Cupboard.jsx";

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
  return (
    <Cupboard source={photos}
      cutoffIndex={8}
      transform={photoToGridItem}
      className="grid grid-cols-3 gap-2"
      initialShowMore={window.innerWidth >= convertRemToPixels(64)}
    />
  );
}
