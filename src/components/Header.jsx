import { Link } from 'react-router-dom';
import React from 'react';
import RssTicker from './RssTicker';

const headerTextClassName = `
    text-lg
    text-gray-900 dark:text-gray-200
    hover:font-bold focus:font-bold
    focus:outline-none
    focus:ring-2
    focus:ring-gray-400
    px-1
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
                <Link to="/" aria-label="Go to homepage">
                    <span className={headerTextClassName}>alvarado.dev</span>
                </Link>
                <nav className="flex gap-6" aria-label="Main navigation">
                    <Link to="/" aria-label="Home">
                        <span className={headerTextClassName}>Home</span>
                    </Link>
                    <Link to="/noah" aria-label="Noah">
                        <span className={headerTextClassName}>Noah</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
