import { Link } from 'react-router-dom';
import React from 'react';
import RssTicker from './RssTicker';
import { routes } from '../routes.jsx';

const hoverAndFocusClassName = `
    flex justify-center 
    px-4
    rounded-sm
    hover:font-extrabold focus-visible:font-extrabold
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-gray-900
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
            <div className="hidden md:block"><RssTicker /></div>
            <div className="flex items-center justify-between px-8 py-4 border-t-2 border-gray-900">
                <Link to="/" aria-label="Go to homepage" className={`w-36 ${hoverAndFocusClassName} ${headerTextClassName}`}>
                    alvarado.dev
                </Link>
                <nav className="flex gap-6" aria-label="Main navigation">
                    {routes.map(({ path, label }) => (
                        <Link key={path} to={path} aria-label={label} className={`w-16 ${hoverAndFocusClassName} ${headerTextClassName}`}>
                            {label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
