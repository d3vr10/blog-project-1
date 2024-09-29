"use client";

import { createContext, useContext, useState } from "react";

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
    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}