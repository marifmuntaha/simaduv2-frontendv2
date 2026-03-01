export interface ThemeState {
    main: string;
    sidebar: string;
    sidebarCompact: boolean;
    sidebarVisibility: boolean;
    sidebarMobile: boolean;
    header: string;
    skin: string;
}

export interface ThemeActions {
    uistyle: (value: string) => void;
    sidebar: (value: string) => void;
    sidebarCompact: () => void;
    sidebarVisibility: () => void;
    sidebarHide: () => void;
    header: (value: string) => void;
    skin: (value: string) => void;
    reset: () => void;
}
