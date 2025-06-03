import { Link } from 'react-router-dom';
import React from 'react';

function TitleCard({ children, href, ariaLabel, target, className = '' }) {
  const baseClasses = `
    block
    p-4
    bg-white dark:bg-gray-800
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

  if (href) {
    return (
      <Link
        to={href}
        aria-label={ariaLabel}
        target={target}
        className={`${baseClasses} ${pointerClass}`}
      >
        {children}
      </Link>
    );
  } else {
    return (
      <div className={baseClasses}>
        {children}
      </div>
    );
  }
}

export default TitleCard;
