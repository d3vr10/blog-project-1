import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { GitHubIcon, GoogleIcon } from "../icons";
import Image from "next/image"
import Link from "next/link";

const authSchema = z.object({
    username: z.string().min(4),
    password: z.string().min(8),
})

export default function AuthForm() {
    const form = useForm({ mode: "all", resolver: zodResolver(authSchema) })
    return (
        <Form {...form}>
            <FormField
                name="username"
                render={(field) => (
                    <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="eduardito123" {...field} />
                        </FormControl>
                        <FormDescription>Tu nombre de usuario</FormDescription>
                    </FormItem>
                )}
            />
            <FormField
                name="password"
                render={(field) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="*************" {...field} />
                        </FormControl>
                        <FormDescription>Tu contrasenna</FormDescription>
                    </FormItem>
                )}
            />

            <Button>Login</Button>
            <div className="text-center"><Link href={""} className="text-blue-400 text-sm">Forgot password?</Link></div>
            <div className="flex justify-between items-center gap-x-4 my-4">
                <span className="h-[1px] flex-grow block bg-zinc-400"></span>
                <span className="text-sm">OR</span>
                <span className="h-[1px] flex-grow block bg-zinc-400"></span>

            </div>

            <Button className="flex gap-x-2"><GitHubIcon className="h-full w-auto" />Github</Button>
            <Button className="flex gap-x-2"><Image width={30} height={30} className="h-full w-auto" alt="Google brand icon" src={"/icons/google/logo.png"} />Google</Button>
            <Button className="flex gap-x-2"><Image width={30} height={30} className="h-full w-auto" alt="X brand icon" src={"/icons/x/logo-black.png"} />Twitter</Button>

            <div className="text-sm text-center">
                <span>Don't have an account? <Link className="text-blue-400 font-bold" href={"/signup"}>Sign up</Link></span>
            </div>


        </Form>
    )
}