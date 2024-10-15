import {Button} from "@/components/ui/button";
import Link from "next/link";
import {HouseIcon} from "lucide-react";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {

    return (

        <div
            className={"absolute top-1/2 border-2 rounded-lg p-6 flex flex-col gap-y-4 left-1/2 -translate-y-1/2 -translate-x-1/2"}
        >
            <Button className={"w-fit"} variant={"outline"} asChild>
                <Link href={"/"}>
                    Go Home <HouseIcon className={"ml-2 h-4 w-4"}/>
                </Link>
            </Button>
            {children}
        </div>
    )
}