import React from 'react';
import TitleCard from '../components/TitleCard.jsx';

export default function Landing() {
    return (
        <div
            className="
                w-full h-full
                flex flex-col items-center justify-center
                bg-[#fdf6e3] dark:bg-gray-900
                px-[72px] gap-8
            "
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
