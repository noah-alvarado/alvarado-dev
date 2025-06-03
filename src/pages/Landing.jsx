import OptimizedImage from '../components/OptimizedImage.jsx';
import React from 'react';
import TitleCard from '../components/TitleCard.jsx';
import { pageContentClassName } from '../styles/styles.js';

export default function Landing() {
    return (
        <div
            className={`
                ${pageContentClassName}
                w-full flex-1
                flex flex-col items-center justify-center
                gap-8
                bg-[#fdf6e3] dark:bg-gray-900
            `}
        >
            <h1
                className="
                    text-3xl font-bold mb-2
                    text-gray-900 dark:text-gray-100
                    cursor-default
                "
            >
                Welcome to:<span className="text-4xl pl-3">alvarado.dev</span>
            </h1>
            <TitleCard href="/noah" alt="Go to Noah's site" target="_self" className="bg-[#e0f7fa] dark:bg-gray-800">
                <h2 className="text-2xl font-semibold">Noah</h2>
                <OptimizedImage basePath="noah/noah-2" alt="Noah Alvarado pictured in Sioux Falls, SD" />
            </TitleCard>
        </div>
    );
}
