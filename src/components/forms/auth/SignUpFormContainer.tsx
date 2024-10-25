"use client";

import {userCreateSchema, UserCreateType} from "@/lib/schemas/user";
import {zodResolver} from "@hookform/resolvers/zod";
import {SubmitHandler, useForm} from "react-hook-form";
import {signUp} from "@/actions/auth";
import {useRouter} from "next/navigation";
import {useToast} from "@/hooks/use-toast";
import {useAuth} from "@/app/(auth)/auth/_components/context";
import SignUpFormPresentation from "@/components/forms/auth/SignUpFormPresentation";


export default function SignUpFormContainer() {
    const {auth, setAuth} = useAuth()
    const router = useRouter()
    const {toast} = useToast()
    const form = useForm<UserCreateType>({
        defaultValues: {
            username: "",
            email: "",
            password: "",
            repeatPassword: "",
        },
        mode: "all",
        resolver: zodResolver(userCreateSchema)
    })
    const onSubmit: SubmitHandler<UserCreateType> = async (values) => {
        const response = await signUp(values)

        let title = "Success"
        let description = "Account was created!"
        if (response.error) {
            title = ""
            description = ""
            if (response.status === 409) {
                title = "Sign up Error"
                description = "This account already exists"
            } else if (response.status >= 500) {
                title = "Server Error"
                description = "Something happened on our side. It's not you. We'll be working on it"
            }
        } else {
            setAuth(response.payload)
        }
        toast({
            title: title,
            description: description,
            variant: response.error ? "destructive" : "default",
        })
        router.push("/")
    }
    return (
        <SignUpFormPresentation form={form} onSubmit={onSubmit} />

    )

}


