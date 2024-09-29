"use client"

import Image from "next/image";
import { AuthDialog } from "./auth/auth-dialog";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import ToggleThemeDropdown from "./toggle-theme-dropdown";
import { Moon, Sun } from "lucide-react";
import { AuthContext, useAuth } from "./auth/context";

export default function Navbar() {
    const { auth } = useAuth()
    
    return (
        <nav className="py-2 px-4">
            <div className="flex justify-between items-center">
                <div>
                    <Image src={""} height={40} width={40} alt="" />
                </div>
                <div className="flex items-center gap-x-4">
                    <ToggleThemeDropdown />
                    {auth && `Hello, <span className="font-semibold">${auth.username}</span>` || <AuthDialog />}
                </div>
            </div>
        </nav>
    )
}