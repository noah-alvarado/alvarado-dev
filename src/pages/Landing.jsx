import React from 'react';
import OptimizedImage from '../components/OptimizedImage.jsx';
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
                    text-center
                "
            >
                Welcome&nbsp;to <span className="text-4xl pl-1">alvarado.dev</span>
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-6">
                <TitleCard
                    href="/noah"
                    ariaLabel="Go to Noah's site"
                    target="_self"
                    image="noah/biking-headshot"
                    imageAlt="Noah"
                    title="Noah"
                    subtitle="Sioux Falls, SD"
                />
                <TitleCard
                    href="/pacific"
                    ariaLabel="Go to the PACIFIC site"
                    target="_self"
                    image="pacific/spread"
                    imageAlt="PACIFIC Board Game"
                    title="PACIFIC"
                    subtitle="Digital Adaptation"
                />
            </div>
        </div>
    );
}
