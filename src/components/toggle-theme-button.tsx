"use client";

import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
export default function ToggleThemeButton() {
    const { theme, setTheme } = useTheme()

    return (
        <Button onClick={() => {
            if (theme === "dark")
                setTheme("light")
            else setTheme("dark")
        }}>
            {theme === "dark" ? <Moon /> : <Sun />}
        </Button>
    )
}