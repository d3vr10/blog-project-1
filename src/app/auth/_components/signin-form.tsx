"use client";

import {type SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod"
import {Form, FormControl, FormField, FormItem} from "../../../components/ui/form";
import {Input} from "../../../components/ui/input";
import {Button} from "../../../components/ui/button";
import {GitHubIcon} from "../../../components/icons";
import Image from "next/image"
import Link from "next/link";
import LoaderButton from "../../../components/loader-button";
import {signIn} from "@/lib/auth/actions";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {useAuth} from "./context";
import {Dispatch, useRef, useState} from "react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {AlertCircle, AtSign, ChevronDown, KeyIcon, User} from "lucide-react";
import {clsx} from "clsx";

const authSchema = z.object({
    username: z.string().min(4),
    email: z.string().email().optional(),
    password: z.string().min(8),
}).refine(data => data.email || data.password, {
    message: "At least one of email or password must be supplied",
    path: ["email", "password"], // Specify which fields to attach the error to
});

type AuthSchemaType = z.infer<typeof authSchema>

type ResetMethod = "email" | "username"

const ResetMethodIcon = ({method}: { method: ResetMethod }) => {
    return method === "email" ? <AtSign className="h-4 w-4"/> : <User className="h-4 w-4"/>
}
const CustomKeyInput = ({
                            signInMethod,
                            setSignInMethod
                        }: {
    signInMethod: "username" | "email",
    setSignInMethod: (value: "username" | "email") => void,
}) => {
    return (
        <div className="relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="absolute left-0 top-0 bottom-0 px-3 hover:bg-accent hover:text-accent-foreground"
                    >
                        <ResetMethodIcon method={signInMethod}/>
                        <ChevronDown className="h-4 w-4 ml-2"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setSignInMethod("username")}>
                        <User className="h-4 w-4 mr-2"/>
                        Username
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSignInMethod("email")}>
                        <AtSign className="h-4 w-4 mr-2"/>
                        Email
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <FormField name={"email"} render={({field, fieldState}) => (
                <FormItem className={clsx({
                    "hidden": signInMethod === "username",
                })}>
                    <Input
                        type={"email"}
                        placeholder={"Enter your email"}
                        className={`pl-20 ${fieldState.error ? "border-destructive" : ""}`}
                        {...field}
                    />
                    {fieldState.error && (
                        <p className="text-sm font-medium text-destructive flex items-center mt-2">
                            <AlertCircle className="h-4 w-4 mr-2"/>
                            {fieldState.error.message}
                        </p>
                    )}
                </FormItem>
            )}/>
            <FormField name={"username"} render={({field, fieldState}) => (
                <FormItem className={
                    clsx({
                        "hidden": signInMethod === "email"
                    })
                }>
                    <Input
                        type={"text"}
                        placeholder={"Enter your username"}
                        className={`pl-20 ${fieldState.error ? "border-destructive" : ""}`}
                        {...field}
                    />
                    {fieldState.error && (
                        <p className="text-sm font-medium text-destructive flex items-center mt-2">
                            <AlertCircle className="h-4 w-4 mr-2"/>
                            {fieldState.error.message}
                        </p>
                    )}
                </FormItem>
            )}/>
        </div>
    )
}

export default function SigninForm({setOpen}: { setOpen: Dispatch<any> }) {
    const formRef = useRef<HTMLFormElement | null>(null)
    const {auth, setAuth} = useAuth()
    const [signInMethod, setSignInMethod] = useState<"username" | "email">("username")
    const router = useRouter()
    const {toast} = useToast()
    const defaultValues = {
        email: "",
        username: "",
        password: "",
    }
    const form = useForm<AuthSchemaType>({
        mode: "all",
        resolver: zodResolver(authSchema),
        defaultValues: defaultValues,
    })
    const {resetField, formState: {errors}, formState} = form;
    const onSubmit: SubmitHandler<AuthSchemaType> = async (values) => {
        const response = await signIn({signInValue: values[signInMethod], signInMethod: signInMethod}, values.password)
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
        setAuth(response.payload)
        toast({
            title: "Success",
            description: "You have been authenticated",
        })
        router.push("/")
    }
    return (
        <Form {...form}>
            <form className="flex flex-col gap-y-4" onSubmit={form.handleSubmit(onSubmit)} ref={formRef}>
                <CustomKeyInput signInMethod={signInMethod} setSignInMethod={setSignInMethod}/>
                <div className={"relative"}>
                    <Button
                        variant={"outline"}
                        disabled
                        className={"absolute left-0 bottom-0 top-0 px-[22px] text-primary"}
                    >
                        <KeyIcon className={"w-5 h-5 text-primary"}/>
                    </Button>
                    <FormField
                        name="password"
                        render={({field, fieldState: {error}}) => (
                            <FormItem className={""}>
                                <FormControl>
                                    <Input type="password" className={"pl-20"} placeholder="*************" {...field} />
                                </FormControl>

                                {error && (
                                    <p className="text-sm font-medium text-destructive flex items-center mt-2">
                                        <AlertCircle className="h-4 w-4 mr-2"/>
                                        {error.message}
                                    </p>
                                )}
                            </FormItem>
                        )}
                    />
                </div>
                <LoaderButton
                    type={"button"}
                    onClick={() => {
                        const signInValue = form.getValues()[signInMethod]
                        if (signInMethod === "username") {
                            resetField("email", {
                                defaultValue: defaultValues.email,
                            })
                        } else {
                            resetField("username", {
                                defaultValue: defaultValues.username,
                            })
                        }

                        formRef.current?.requestSubmit()
                    }}
                    isSubmitting={formState.isSubmitting}
                />

                {errors?.root ? <div className="text-sm text-red-800 text-center">{errors.root.message}</div> : ""}

                <div className="text-center"><Link href={"/auth/forgot-password"} onClick={() => setOpen(false)}
                                                   className="text-blue-400 text-sm">Forgot password?</Link></div>
                <div className="flex justify-between items-center gap-x-4 my-4">
                    <span className="h-[1px] flex-grow block bg-zinc-400"></span>
                    <span className="text-sm">OR</span>
                    <span className="h-[1px] flex-grow block bg-zinc-400"></span>
                </div>
                <Button className="flex gap-x-2"><GitHubIcon className="h-full w-auto"/>Github</Button>
                <Button className="flex gap-x-2"><Image width={30} height={30} className="h-full w-auto"
                                                        alt="Google brand icon"
                                                        src={"/icons/google/logo.png"}/>Google</Button>
                <Button className="flex gap-x-2"><Image width={30} height={30} className="h-full w-auto"
                                                        alt="X brand icon"
                                                        src={"/icons/x/logo-black.png"}/>Twitter</Button>
                <div className="text-sm text-center">
                    <span>Don&apos;t have an account? <Link onClick={() => setOpen(false)}
                                                            className="text-blue-400 font-bold" href={"/auth/signup"}>Sign up</Link></span>

                </div>
            </form>

        </Form>
    )
}