import { createContext, useContext } from "react";
import type { UserType } from "@/common/types";

interface UseAuthContextInterface {
    isLogged: boolean;
    setIsLogged(isLogged: boolean): void;
    user?: UserType;
    setUser(user: UserType): void;
}

const INIT: UseAuthContextInterface = {
    isLogged: false,
    setIsLogged(isLogged: boolean) {
        return isLogged
    },
    user: undefined,
    setUser(user: UserType) {
        return user
    }
}

export const AuthContext = createContext<UseAuthContextInterface>(INIT);

export function useAuthContext() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuthContext must be used within AuthContext");
    }
    return context;
}