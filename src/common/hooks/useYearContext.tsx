import { createContext, useContext } from "react";
import type { YearType } from "@/common/types";

export const YearContext = createContext<YearType|undefined>(undefined);

export function useYearContext(): YearType | undefined {
    const context = useContext(YearContext)
    if (!context) {
        throw new Error("useYearContext must be used within YearContext");
    }
    return context;
}