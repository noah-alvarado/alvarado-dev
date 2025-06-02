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
                "
            >
                Welcome to alvarado.dev
            </h1>
            <TitleCard href="/noah" alt="Go to Noah's site" target="_self">
                <h2>Noah Alvarado</h2>
            </TitleCard>
        </div>
    );
}
