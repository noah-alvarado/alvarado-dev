import { useEffect, useState } from "react";

function getPreferredTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
};

// Class-based dark mode: toggling `dark` on <html> drives the
// @custom-variant in src/styles/App.css. The inline script in index.html
// applies the same logic before React loads to avoid a flash — keep the
// three in sync.
export default function useTheme() {
    const [theme, _setTheme] = useState(localStorage.getItem("theme") ?? getPreferredTheme());

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    const setTheme = (newTheme) => {
        _setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return [theme, setTheme];
}
