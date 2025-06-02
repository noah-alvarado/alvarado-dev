import React from 'react';

function TitleCard({ children, href, alt, target, className = '' }) {
  const baseClasses = `
    block
    p-14
    bg-white dark:bg-gray-800
    rounded-3xl
    shadow-[0_8px_40px_0_rgba(0,0,0,0.18)]
    hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.28)]
    border border-gray-200 dark:border-gray-700
    transition-all duration-300
    text-center
    ${className}
  `;
  const pointerClass = href ? 'cursor-pointer' : '';

  if (href) {
    return (
      <a
        href={href}
        alt={alt}
        target={target}
        className={`${baseClasses} ${pointerClass}`}
      >
        {children}
      </a>
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
