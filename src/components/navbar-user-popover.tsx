"use client";
import {Popover, PopoverContent, PopoverTrigger} from "./ui/popover";
import {Button} from "./ui/button";
import {ChartBarIncreasing, LogOut as LogOutIcon, User2,} from "lucide-react";
import {useAuth} from "@/app/auth/_components/context";
import Link from "next/link";
import {logout} from "@/lib/auth/actions";
import {useState} from "react";


export default function NavbarUserPopover(  ) {
    const [ open, setOpen ] = useState(false);
    const { auth, setAuth } = useAuth()
    const handleLogout = async () => {
        await logout()
        setOpen(false);
        setAuth(null)
    }
    return (
        <Popover open={open} onOpenChange={() => setOpen((state) => !state)}>
            <PopoverTrigger  asChild>
                <Button variant="outline" className="w-[105.4px] flex gap-x-1 items-center"><User2 />{auth.username}</Button>
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

                        <Link onClick={() => setOpen(false)} className="flex items-center gap-x-4 " href={"/dashboard"}><Button className="">
                            <ChartBarIncreasing /><span>Dashboard</span>
                        </Button></Link>
                        <Button className=" " onClick={ handleLogout}><LogOutIcon />Logout</Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}