"use client";

import { validateSession } from "@/lib/auth/actions";
import React, { createContext, useContext, useEffect, useState } from "react";

const initialValue = undefined

export const AuthContext = createContext<any>(initialValue)

export function useAuth() {
    const authContext = useContext(AuthContext)
    if (authContext === undefined)
        throw new Error("AuthProvider must wrap the calling childs")
    return authContext
}
export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [auth, setAuth] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        (async () => {
            const result = await validateSession()
            if (!result.error) {
                setAuth(result.payload)
            }
            setLoading(false)
        })()
    }, [])
    return (
        <AuthContext.Provider value={{ auth, setAuth, loading }}>
            {children}
        </AuthContext.Provider>
    )
}