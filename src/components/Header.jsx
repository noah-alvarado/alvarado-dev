import { Link } from 'react-router-dom';
import { routes } from '../routes.jsx';
import useTheme from '../providers/useTheme.js';
import useWindowWidth from '../providers/useWindowWidth.js';
import { useEffect, useMemo, useState } from 'react';

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

const themeToggleClassName = `
    inline-block
    relative
    w-fit
    border-none bg-transparent
    text-gray-900 dark:text-gray-200
    cursor-pointer
    rounded-[10px]
    transition-transform duration-150
    hover:-translate-y-0.5 hover:scale-[1.04]
    focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-gray-900
    active:translate-y-[1px] active:scale-95
`;

const burgerButtonClassName = `
    group
    flex flex-col justify-center items-center gap-[6px] hover:gap-[5px]
    w-11 h-11 px-2
    bg-transparent border-none
    text-gray-900 dark:text-gray-200
    rounded-md
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900
    active:translate-y-[1px] active:scale-95
`;

const burgerBarClassName = `
    block h-[2px] group-hover:h-[3px] w-full rounded-full
    bg-gray-900 dark:bg-gray-200
`;

const ThemeToggle = () => {
    const [theme, setTheme] = useTheme();

    const toggleDarkMode = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
    };

    return (
        <button
            type="button"
            aria-label={
                theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            onClick={toggleDarkMode}
            className={themeToggleClassName}
        // class={`${styles.themeToggle} ${styles.clickable}`}
        >
            {theme === "dark" ? "🌙" : "☀️"}
        </button>
    );
}

export default function Header() {
    const windowWidth = useWindowWidth();
    const [navOpen, setNavOpen] = useState(false);

    const showBurger = useMemo(() => windowWidth < 720, [windowWidth]);

    useEffect(() => {
        if (!showBurger) {
            setNavOpen(false);
        }
    }, [showBurger]);

    const handleToggleNav = () => setNavOpen((open) => !open);
    const handleNavLinkClick = () => {
        if (showBurger) {
            setNavOpen(false);
        }
    };

    const navBaseClassName = showBurger
        ? `absolute right-8 top-[calc(100%+0.75rem)] z-20
           flex flex-col gap-3
           bg-[#fdf6e3] dark:bg-gray-900
           border border-gray-900 dark:border-gray-200
           rounded-md shadow-lg
           px-4 py-3
           transition duration-200
           ${navOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'}`
        : 'flex gap-6 items-center';

    return (
        <header
            className="w-full bg-[#fdf6e3] dark:bg-gray-900 shadow-md"
            role="banner"
            aria-label="Site header"
        >
            <div className="flex items-center justify-between px-8 py-4 border-t-2 border-gray-900 relative">
                <div className="flex gap-2 items-center">
                    <ThemeToggle />
                    <Link to="/" aria-label="Go to homepage" className={`w-36 ${hoverAndFocusClassName} ${headerTextClassName}`}>
                        alvarado.dev
                    </Link>
                </div>

                {showBurger && (
                    <button
                        type="button"
                        className={burgerButtonClassName}
                        aria-label={navOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-controls="main-navigation"
                        aria-expanded={navOpen}
                        onClick={handleToggleNav}
                    >
                        <span aria-hidden="true" className={burgerBarClassName} />
                        <span aria-hidden="true" className={burgerBarClassName} />
                        <span aria-hidden="true" className={burgerBarClassName} />
                    </button>
                )}

                <nav
                    id="main-navigation"
                    className={navBaseClassName}
                    aria-label="Main navigation"
                    aria-hidden={showBurger && !navOpen}
                >
                    {routes.map(({ path, label }) => (
                        <Link
                            key={path}
                            to={path}
                            aria-label={label}
                            onClick={handleNavLinkClick}
                            className={`${showBurger ? 'w-full text-left' : 'w-16'} ${hoverAndFocusClassName} ${headerTextClassName}`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
