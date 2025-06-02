import React from 'react';

function TitleCard() {
  return (
    <a
      href="https://alvarado.dev"
      className="
        block
        p-14
        bg-white dark:bg-gray-800
        rounded-3xl
        shadow-[0_8px_40px_0_rgba(0,0,0,0.18)]
        hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.28)]
        border border-gray-200 dark:border-gray-700
        transition-all duration-300
        text-center
        cursor-pointer
      "
    >
      <p
        className="
          text-gray-600 dark:text-gray-300
        "
      >
        Click this box to visit my site!
      </p>
    </a>
  );
}

export default TitleCard;
