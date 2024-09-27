"use client";

import Image from "next/image";
import { AuthDialog } from "./auth/auth-dialog";

export default function Navbar() {
    return (
        <nav className="py-2 px-4">
            <div className="flex justify-between">
                <div>
                    <Image src={""} height={40} width={40} alt=""/>
                </div>
                <div className="">
                    <AuthDialog />
                </div>
            </div>
        </nav>
    )
}