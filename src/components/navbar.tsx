"use client";

import Image from "next/image";
import { AuthDialog } from "./auth/auth-dialog";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
export default function Navbar() {
    return (
        <nav className="py-2 px-4">
            <div className="flex justify-between">
                <div>
                    <Image src={""} height={40} width={40} alt=""/>
                </div>
                <div className="">
                    <Button></Button>
                    <AuthDialog />
                </div>
            </div>
        </nav>
    )
}