"use client";
import {useEffect, useRef, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/hooks/use-toast";
import {z} from "zod";
import {generateForgotPasswordToken} from "@/actions/auth";
import {
    ForgotPasswordFormPresentation
} from "@/components/forms/forgot-password/ForgotPasswordFormPresentation";

const forgotEmailSchema = z.object({
    email: z.union([z.string().email(), z.literal("")]),
    username: z.union([z.string().min(8).regex(/^[a-z0-9_-]+$/i), z.literal("")]),
    atLeastOne: z.unknown().optional(),
}).refine((value) => value.email.length > 0 || value.username.length > 0, {
    message: "At least one of both fields must be filled out",
    path: ["atLeastOne"]
});
export type ForgotEmailSchema = z.infer<typeof forgotEmailSchema>

export type ResetMethod = "email" | "username"

export default function ForgotPasswordFormContainer() {
    const [resetMethod, setResetMethod] = useState<ResetMethod>("email")
    const [sentEmail, setSentEmail] = useState(false);
    const formRef = useRef<null | HTMLFormElement>(null);
    const submitBtnRef = useRef<null | HTMLButtonElement>(null)
    const defaultValues = {
        email: "",
        username: "",
    }
    const form = useForm<ForgotEmailSchema>({
        resolver: zodResolver(forgotEmailSchema),
        mode: "all",
        defaultValues: defaultValues,
    });
    useEffect(() => {
        if (typeof window !== "undefined") {
        }
    }, []);
    const onSubmit: SubmitHandler<ForgotEmailSchema> = async (value) => {
        const res = await generateForgotPasswordToken({
            resetMethod,
            resetValue: value[resetMethod] as string,
        })
        if (res.error) {
            let title;
            let message;
            if (res.status === 404) {
                title = "Not Found"
                message = `Account with this ${resetMethod} doesn't exist`
            } else {
                title = "Server Error"
                message = "There occurred an error while processing your request"
            }
            toast({
                title: title,
                description: message,
            })
            return;
        }
        setSentEmail(true)
    }
    return <ForgotPasswordFormPresentation
        form={form}
        onSubmit={onSubmit}
        setResetMethod={setResetMethod}
        formRef={formRef}
        submitBtnRef={submitBtnRef}
        resetMethod={resetMethod}
        sentEmail={sentEmail}
    />
}


