import Link from "next/link";
import {Button} from "@/components/ui/button";

export default async function Page() {
    return (
        <div className={"absolute top-1/2 border-2 rounded-lg p-6 flex flex-col gap-y-4 left-1/2 -translate-y-1/2 -translate-x-1/2"}>
            <h1 className={"text-3xl tracking-tight"}>Please check your email and click on the verification link to <span className={"italic"}>reset</span> your password!</h1>
            <div className={"flex gap-x-4 items-center"}>
                <div className={"h-1 bg-secondary flex-grow"}></div>
                <div className={""}>OR</div>
                <div className={"h-1 bg-secondary flex-grow"}></div>
            </div>
            <Button className={"bg-blue-400 hover:bg-blue-600 w-fit self-center"}><Link className={""}
                          href={"/"}>Go
                back to home page</Link></Button>
        </div>
    )
}