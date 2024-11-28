"use client"

import Image from "next/image";
import AuthDialogContainer from "@/components/forms/auth/AuthDialogContainer";
import ToggleThemeDropdown from "../ui/toggle-theme-dropdown";
import {useAuth} from "@/app/(auth)/auth/_components/context";
import Link from "next/link";
import NavbarUserPopover from "./NavbarUserPopover";
import {Skeleton} from "@/components/ui/skeleton";

export default function Navbar() {
    const {auth, loading} = useAuth()
    return (
        <nav className="py-2 px-4">
            <div className="flex justify-between items-center">
                <Link href={"/public"} className="flex gap-x-2 items-center">
                    <Image src={"/images/mono-arc-center.svg"} height={40} width={40} alt=""/>
                    <span className="tracking-tight text-xl font-semibold font-italic">MonoArc</span>
                </Link>
                <div className="flex items-center gap-x-4">
                    <ToggleThemeDropdown/>
                    <div className={"transition-[width] w-fit"}>{
                        loading
                            ? <Skeleton className={"w-[104.5px] h-8"}/>
                            : auth
                                ? <NavbarUserPopover/>
                                : <AuthDialogContainer/>
                    }</div>
                </div>
            </div>
        </nav>
    )
}