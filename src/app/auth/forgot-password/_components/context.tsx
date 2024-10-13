"use client";

import {createContext, ReactNode, useState} from "react";

const ForgotPasswordContext = createContext<any | undefined>(undefined)


export default async function ForgotPasswordProvider({children}: {children: React.ReactNode}) {
    const [email, setEmail] = useState<string | null>(null);
    return (
        <ForgotPasswordContext.Provider value={{email, setEmail}}>
            {children}
        </ForgotPasswordContext.Provider>
    )
}
