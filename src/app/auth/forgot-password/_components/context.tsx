"use client";

import {createContext, ReactNode, useContext, useState} from "react";

const ForgotPasswordContext = createContext<any | undefined>(undefined)

export function useForgotPasswordEmail() {
    const context = useContext(ForgotPasswordContext)
    if (context === undefined) {
        throw new Error(`You must wrap first childs with ForgotPasswordProvider. Got "${typeof context}"`)
    }
    return context
}

export default  function ForgotPasswordProvider({children}: {children: React.ReactNode}) {
    const [email, setEmail] = useState<string | null>(null);
    return (
        <ForgotPasswordContext.Provider value={{email, setEmail}}>
            {children}
        </ForgotPasswordContext.Provider>
    )
}
