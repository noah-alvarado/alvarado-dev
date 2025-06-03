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
                    text-center
                "
            >
                Welcome&nbsp;to <span className="text-4xl pl-1">alvarado.dev</span>
            </h1>
            <div className="flex items-center justify-center">
                <TitleCard href="/noah" alt="Go to Noah's site" target="_self" className="bg-[#e0f7fa] dark:bg-gray-800">
                    <div className="flex flex-col-reverse sm:!grid sm:grid-cols-2 sm:gap-4 sm:items-center">
                        <div className="rounded-2xl border-4 border-[#c7d1e6] overflow-hidden mt-2 sm:mt-0">
                            <OptimizedImage
                                basePath="noah/noah-1"
                                alt="Noah outside Roscoe Village Bikes in Chicago, wearing a purple shirt, turquoise Joshua Tree National Park tote bag, and earbuds"
                            />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold">Noah</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mt-1 italic">Sioux Falls, SD</p>
                        </div>
                    </div>
                </TitleCard>
            </div>
        </div>
    );
}
