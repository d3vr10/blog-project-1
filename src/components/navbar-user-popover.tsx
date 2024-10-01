"use client";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { User2, Book, LogOut as LogOutIcon, ChartBar, ChartArea, ChartBarIncreasing, SquareArrowOutUpRight, PanelRightOpen, SquareArrowRight, } from "lucide-react";
import { useAuth } from "./auth/context";
import Link from "next/link";
import { logout } from "@/lib/auth/actions";


export default function NavbarUserPopover() {
    const { auth, setAuth } = useAuth()
    const handleLogout = async () => {
        await logout()
        setAuth((state: any) => ({ setAuth, auth: undefined }))
    }
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="flex gap-x-1 items-center"><User2 />{auth.username}</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Dimensions</h4>
                        <p className="text-sm text-muted-foreground">
                            Set the dimensions for the layer.
                        </p>
                    </div>
                    <div className="flex flex-col gap-y-3 [&_button]:flex [&_button]:gap-x-2 [&_button]:justify-start">

                        <Link className="flex items-center gap-x-4 grid" href={"/dashboard"}><Button className="">
                            <ChartBarIncreasing /><span>Dashboard</span>
                        </Button></Link>
                        <Button className=" " onClick={ handleLogout}><LogOutIcon />Logout</Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}