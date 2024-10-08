"use client";

import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { GitHubIcon, GoogleIcon } from "../../../components/icons";
import Image from "next/image"
import Link from "next/link";
import LoaderSubmitButton from "../../../components/loader-submit-button";
import { signIn } from "@/lib/auth/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "./context";
import {Dispatch} from "react";

const authSchema = z.object({
    username: z.string().min(4),
    password: z.string().min(8),
})

type AuthSchemaType = z.infer<typeof authSchema>

export default function SigninForm({ setOpen }: { setOpen: Dispatch<any>}) {
    const auth = useAuth()
    const router = useRouter()
    const { toast } = useToast()
    const form = useForm<AuthSchemaType>({
        mode: "all", resolver: zodResolver(authSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    })
    const { formState: { errors }, formState } = form;
    const onSubmit: SubmitHandler<AuthSchemaType> = async ({ username, password }) => {
        const response = await signIn(username, password)
        if (response.error) {
            let message = ""
            let title = ""
            if (response.status === 401) {
                title = "Authentication Error"
                message = "Invalid credentials"
            }
            if (response.status >= 500) {
                title = "Server Error"
                message = "It's not you. Something happened on our side and we are going to look into it!"
            }
            toast({
                title: title,
                description: message,
                variant: "destructive",
            })
            return;
        }

        setOpen(false)
        auth.setAuth(state => ({ ...state, auth: response.payload  }))
        toast({
            title: "Success",
            description: "You have been authenticated",
        })
        router.push("/")
    }
    return (
        <Form {...form}>
            <form className="flex flex-col gap-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    name="username"
                    render={({ field, fieldState: { error } }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="eduardito123" {...field} />
                            </FormControl>
                            {error ? <FormMessage /> : <FormDescription>Tu nombre de usuario</FormDescription>}

                        </FormItem>
                    )}
                />
                <FormField
                    name="password"
                    render={({ field, fieldState: { error } }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="*************" {...field} />
                            </FormControl>
                            {error ? <FormMessage /> : <FormDescription>Tu contraseña</FormDescription>}

                        </FormItem>
                    )}
                />
                <LoaderSubmitButton isSubmitting={formState.isSubmitting} />

                {errors?.root ? <div className="text-sm text-red-800 text-center">{errors.root.message}</div> : ""}

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
                    <span>Don&apos;t have an account? <Link onClick={() => setOpen(false)} className="text-blue-400 font-bold" href={"/auth/signup"}>Sign up</Link></span>

                </div>
            </form>

        </Form>
    )
}