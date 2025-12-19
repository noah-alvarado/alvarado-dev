import { useEffect, useState } from "react";

function getPreferredTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
};

export default function useTheme() {
    const [theme, _setTheme] = useState(localStorage.getItem("theme") ?? getPreferredTheme());

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    const setTheme = (newTheme) => {
        if (theme) {
            _setTheme(newTheme);
            localStorage.setItem("theme", newTheme);
        } else {
            const preferredTheme = getPreferredTheme();
            _setTheme(preferredTheme);
            localStorage.removeItem("theme");
        }
    };

    return [theme, setTheme];
}