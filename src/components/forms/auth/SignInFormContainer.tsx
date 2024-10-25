"use client";

import {type SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod"
import {signIn} from "@/actions/auth";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {useAuth} from "@/app/(auth)/auth/_components/context";
import {Dispatch, useRef, useState} from "react";
import SignInFormPresentation from "@/components/forms/auth/SignInFormPresentation";

const authSchema = z.object({
    username: z.union([
        z.string().min(4).regex(
            /^[a-z0-9_-]+$/i,
            {message: "Only alphanumeric characters allowed!"}
        ),
        z.literal("")
    ]),
    email: z.union([z.string().email(), z.literal("")]),
    password: z.string().min(8),
    atLeastOne: z.unknown().optional(),
}).refine((values) => values.username.length > 0 || values.email.length > 0,
    {
        message: "You must provide one of both: username or email",
        path: ["atLeastOne"],
    })

export type AuthSchemaType = z.infer<typeof authSchema>

export type AuthMethod = "email" | "username"

export default function SignInFormContainer({setOpen}: { setOpen: Dispatch<any> }) {
    const formRef = useRef<HTMLFormElement | null>(null)
    const submitBtnRef = useRef<HTMLButtonElement | null>(null)
    const {auth, setAuth} = useAuth()
    const [signInMethod, setSignInMethod] = useState<AuthMethod>("username")
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
    return <SignInFormPresentation
        form={form}
        formRef={formRef}
        setOpen={setOpen}
        setSignInMethod={setSignInMethod}
        signInMethod={signInMethod}
        submitBtnRef={submitBtnRef}
        onSubmit={onSubmit}
    />

}


