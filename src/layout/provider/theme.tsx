import React, { useState, useMemo, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeState, ThemeActions } from "@/common/types";
import { ThemeContext, ThemeUpdateContext } from "@/common/hooks/useThemeContext";


// --- Provider Component ---

const defaultTheme: ThemeState = {
    main: "default",
    sidebar: "white",
    sidebarCompact: false,
    sidebarVisibility: false,
    sidebarMobile: false,
    header: "white",
    skin: "light",
};

export const ThemeProvider = () => {
    const [theme, setTheme] = useState<ThemeState>(defaultTheme);

    const themeUpdate = useMemo<ThemeActions>(() => ({
        uistyle: (value: string) => setTheme((t: ThemeState) => ({ ...t, main: value })),
        sidebar: (value: string) => setTheme((t: ThemeState) => ({ ...t, sidebar: value })),
        sidebarCompact: () => setTheme((t: ThemeState) => ({ ...t, sidebarCompact: !t.sidebarCompact })),
        sidebarVisibility: () => setTheme((t: ThemeState) => ({ ...t, sidebarVisibility: !t.sidebarVisibility })),
        sidebarHide: () => setTheme((t: ThemeState) => ({ ...t, sidebarVisibility: false })),
        header: (value: string) => setTheme((t: ThemeState) => ({ ...t, header: value })),
        skin: (value: string) => setTheme((t: ThemeState) => ({ ...t, skin: value })),
        reset: () => setTheme((t: ThemeState) => ({
            ...t,
            main: defaultTheme.main,
            sidebar: defaultTheme.sidebar,
            header: defaultTheme.header,
            skin: defaultTheme.skin
        })),
    }), []);

    // Initial body class
    useEffect(() => {
        const body = document.querySelector('body');
        if (body) {
            body.className = "nk-body bg-lighter npc-default has-sidebar no-touch nk-nio-theme";
        }
    }, []);

    // Theme-dependent body classes
    useEffect(() => {
        const body = document.body;

        // Handle main theme style
        if (theme.main === "default") {
            body.classList.add("ui-default");
            body.classList.remove("ui-bordered");
        } else if (theme.main === "bordered") {
            body.classList.add("ui-bordered");
            body.classList.remove("ui-default");
        }

        // Handle skin
        if (theme.skin === "dark") {
            body.classList.add("dark-mode");
        } else {
            body.classList.remove("dark-mode");
        }

        // Handle sidebar visibility
        if (theme.sidebarVisibility) {
            body.classList.add("nav-shown");
        } else {
            body.classList.remove("nav-shown");
        }
    }, [theme.main, theme.skin, theme.sidebarVisibility]);

    // Screen resize handler
    useEffect(() => {
        const handleMobileSidebar = () => {
            if (window.innerWidth < 1200) {
                setTheme((t: ThemeState) => ({ ...t, sidebarMobile: true }));
            } else {
                setTheme((t: ThemeState) => ({ ...t, sidebarMobile: false, sidebarVisibility: false }));
            }
        };

        handleMobileSidebar();
        window.addEventListener('resize', handleMobileSidebar);
        return () => window.removeEventListener('resize', handleMobileSidebar);
    }, []);

    return (
        <ThemeContext.Provider value={theme}>
            <ThemeUpdateContext.Provider value={themeUpdate}>
                <Outlet />
            </ThemeUpdateContext.Provider>
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;