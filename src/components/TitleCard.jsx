import React from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../components/OptimizedImage.jsx';

function TitleCard({ children, href, ariaLabel, target, className = '', image, imageAlt, title, subtitle }) {
  const baseClasses = `
    block
    p-4
    bg-[#e0f7fa] dark:bg-gray-800
    rounded-3xl
    shadow-[0_8px_40px_0_rgba(0,0,0,0.18)]
    hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.28)]
    border border-gray-200 dark:border-gray-700
    transition-all duration-300
    text-center
    min-w-[200px] max-w-[330px]
    ${className}
  `;
  const pointerClass = href ? 'cursor-pointer' : '';

  return (
    <Link
      to={href}
      aria-label={ariaLabel}
      target={target}
      className={`${baseClasses} ${pointerClass}`}
    >
      {image ? (
        <div className="flex flex-col-reverse sm:grid sm:grid-cols-2 sm:gap-4 sm:items-center">
          <div className="rounded-2xl border-4 border-[#c7d1e6] overflow-hidden mt-2 sm:mt-0">
            <OptimizedImage
              basePath={image}
              alt={imageAlt}
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-1 italic">{subtitle}</p>
            {children}
          </div>
        </div>
      ) : children}
    </Link>
  );
}

export default TitleCard;
