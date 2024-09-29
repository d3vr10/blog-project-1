"use client";

import { validateSession } from "@/lib/auth/actions";
import { createContext, useContext, useEffect, useState } from "react";

const initialValue = undefined

export const AuthContext = createContext<any>(initialValue)

export function useAuth() {
    const authContext = useContext(AuthContext)
    if (authContext === undefined)
        throw new Error("AuthProvider must wrap the calling childs")
    return authContext
}
export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [auth, setAuth] = useState(initialValue)
    useEffect(() => {
        (async () => {
            const result = await validateSession()
            if (!result.error) {
                const { setAuth } = useAuth()
            }
        })()
    })
    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}