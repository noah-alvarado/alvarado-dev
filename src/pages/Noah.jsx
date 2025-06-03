import NoahProfile from '../components/NoahProfile.jsx';
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
      <NoahProfile />
    </div>
  );
}
