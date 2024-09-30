"use client"

import Image from "next/image";
import { AuthDialog } from "./auth/auth-dialog";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import ToggleThemeDropdown from "./toggle-theme-dropdown";
import { Moon, Sun } from "lucide-react";
import { AuthContext, useAuth } from "./auth/context";
import Link from "next/link";
import NavbarUserPopover from "./navbar-user-popover";

export default function Navbar() {
    const { auth } = useAuth()

    return (
        <nav className="py-2 px-4">
            <div className="flex justify-between items-center">
                <Link href={"/"} className="flex gap-x-2 items-center">
                    <Image src={"/images/mono-arc-center.svg"} height={40} width={40} alt="" />
                    <span className="tracking-tight text-xl font-semibold font-italic">Mono Arc</span>
                </Link>
                <div className="flex items-center gap-x-4">
                    <ToggleThemeDropdown />
                    {auth && (
                        <NavbarUserPopover />
                    ) || <AuthDialog />}
                </div>
            </div>
        </nav >
    )
}