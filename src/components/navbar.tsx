import Image from "next/image";
import { AuthDialog } from "./auth/auth-dialog";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import ToggleThemeDropdown from "./toggle-theme-dropdown";
import { Moon, Sun } from "lucide-react";
export default function Navbar() {
    return (
        <nav className="py-2 px-4">
            <div className="flex justify-between items-center">
                <div>
                    <Image src={""} height={40} width={40} alt="" />
                </div>
                <div className="flex items-center gap-x-4">
                    <ToggleThemeDropdown />
                    <AuthDialog />
                </div>
            </div>
        </nav>
    )
}