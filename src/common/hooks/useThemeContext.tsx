import { createContext, useContext } from "react";
import { ThemeActions, ThemeState } from "@/common/types";

export const ThemeContext = createContext<ThemeState | undefined>(undefined);
export const ThemeUpdateContext = createContext<ThemeActions | undefined>(undefined);

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

export function useThemeUpdate() {
    const context = useContext(ThemeUpdateContext);
    if (context === undefined) {
        throw new Error('useThemeUpdate must be used within a ThemeProvider');
    }
    return context;
}