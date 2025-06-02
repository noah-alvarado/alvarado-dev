import React from 'react';
import { pageContentClassName } from '../styles/styles.js';

export default function Noah() {
  return (
    <div
      className={`
        ${pageContentClassName}
        w-full flex-1
        flex flex-col items-center justify-start
        bg-[#e0f7fa] dark:bg-gray-800
      `}
    >
      <h1
        className="
          text-4xl font-bold mb-8 mt-8
          text-gray-900 dark:text-gray-100
        "
      >
        Welcome to the Noah route!
      </h1>
    </div>
  );
}
