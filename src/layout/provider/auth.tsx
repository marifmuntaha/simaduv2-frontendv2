import { ReactNode, useEffect, useState } from "react";
import { apiCore } from "@/common/api/apiCore";
import { UserType } from "@/common/types";
import { profile as getProfile } from "@/common/api/auth";
import { Loading } from "@/components";
import { AuthContext } from "@/common/hooks/useAuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const api = new apiCore()
    const [loading, setLoading] = useState(true)
    const [isLogged, setIsLogged] = useState(false)
    const [user, setUser] = useState<UserType | undefined>(undefined)

    useEffect(() => {
        const checkLogged = api.getLoggedInToken();
        const profile = () => {
            try {
                getProfile().then((resp) => {
                    setUser(resp)
                })

            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        if (checkLogged) {
            setIsLogged(true)
            profile()
        } else {
            setLoading(false)
        }
    }, []);

    if (loading) return <Loading />

    return (
        <AuthContext.Provider value={{ isLogged, setIsLogged, user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}