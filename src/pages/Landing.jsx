import React from 'react';
import TitleCard from '../components/TitleCard.jsx';

export default function Landing() {
    return (
        <div
            className="
                min-w-screen min-h-screen
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
            <TitleCard />
        </div>
    );
}
