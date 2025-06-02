import { Link } from 'react-router-dom';
import React from 'react';
import RssTicker from './RssTicker';

const hoverAndFocusClassName = `
    flex justify-center 
    px-1
    hover:font-extrabold focus:font-extrabold
    focus:outline-none
    focus:ring-2
    focus:ring-gray-400
`;

const headerTextClassName = `
    text-xl
    font-semibold
    text-gray-900 dark:text-gray-200
`;

export default function Header() {
    return (
        <header
            className="w-full bg-[#fdf6e3] dark:bg-gray-900 shadow-md"
            role="banner"
            aria-label="Site header"
        >
            <RssTicker />
            <div className="flex items-center justify-between px-8 py-4 border-t-2 border-gray-900">
                <Link to="/" aria-label="Go to homepage" className={`w-36 ${hoverAndFocusClassName} ${headerTextClassName}`}>
                    alvarado.dev
                </Link>
                <nav className="flex gap-6" aria-label="Main navigation">
                    <Link to="/" aria-label="Home" className={`w-16 ${hoverAndFocusClassName} ${headerTextClassName}`}>
                        Home
                    </Link>
                    <Link to="/noah" aria-label="Noah" className={`w-16 ${hoverAndFocusClassName} ${headerTextClassName}`}>
                        Noah
                    </Link>
                </nav>
            </div>
        </header>
    );
}
