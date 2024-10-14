"use client";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {AlertCircle, AtSign, ChevronDown, User} from "lucide-react";
import {SubmitHandler, useForm} from "react-hook-form";
import z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {generateForgotPasswordToken} from "@/app/auth/forgot-password/actions";
import {toast} from "@/hooks/use-toast";
import {useForgotPasswordEmail} from "@/app/auth/forgot-password/_components/context";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import LoaderSubmitButton from "@/components/loader-submit-button";
import {Form, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {clsx} from "clsx";

const forgotEmailSchema = z.object({
    email: z.string().email().optional(),
    username: z.string().optional(),
})
type ForgotEmailSchema = z.infer<typeof forgotEmailSchema>

type ResetMethod = "email" | "username"

const ResetMethodIcon = ({method}: { method: ResetMethod }) => {
    return method === "email" ? <AtSign className="h-4 w-4"/> : <User className="h-4 w-4"/>
}

const CustomInput = ({
                         resetMethod,
                         setResetMethod,
                         inputValue,
                         setInputValue,
                     }: {
    resetMethod: ResetMethod
    setResetMethod: (method: ResetMethod) => void
    inputValue: string
    setInputValue: (value: string) => void
}) => {
    return (
        <div className="relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="absolute left-0 top-0 bottom-0 px-3 hover:bg-accent hover:text-accent-foreground"
                    >
                        <ResetMethodIcon method={resetMethod}/>
                        <ChevronDown className="h-4 w-4 ml-2"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setResetMethod("email")}>
                        <AtSign className="h-4 w-4 mr-2"/>
                        Email
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setResetMethod("username")}>
                        <User className="h-4 w-4 mr-2"/>
                        Username
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <FormField name={"email"} render={({field, fieldState}) => (
                <FormItem className={clsx({
                    "hidden": resetMethod === "username",
                })}>
                    <Input
                        type={"email"}
                        placeholder={"Enter your email"}
                        className={`pl-24 ${fieldState.error ? "border-destructive" : ""}`}
                        {...field}
                    />
                    { fieldState.error && (
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
                        "hidden": resetMethod === "email"
                    })
                }>
                    <Input
                        type={"text"}
                        placeholder={"Enter your username"}
                        className={`pl-24 ${fieldState.error ? "border-destructive" : ""}`}
                        {...field}
                    />
                    { fieldState.error && (
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


export default function Page() {
    const [resetMethod, setResetMethod] = useState<ResetMethod>("email")
    const [inputValue, setInputValue] = useState("")
    const {email, setEmail} = useForgotPasswordEmail();
    const form = useForm<ForgotEmailSchema>({
        resolver: zodResolver(forgotEmailSchema),
        mode: "all",
        defaultValues: {
            email: "",
            username: "",
        }
    });
    useEffect(() => {
        if (typeof window !== "undefined") {
        }
    }, []);
    const {handleSubmit, formState} = form
    const onSubmit: SubmitHandler<ForgotEmailSchema> = async ({email}) => {
        const res = await generateForgotPasswordToken(email)
        if (res.error) {
            let title;
            let message;
            if (res.status === 404) {
                title = "Not Found"
                message = "An account with this email doesn't exist"
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
        setEmail(true)
    }
    return (
        <div
            className={"absolute top-1/2 border-2 rounded-lg p-6 flex flex-col gap-y-4 left-1/2 -translate-y-1/2 -translate-x-1/2"}>
            {!email && (
                <Card className="w-full mx-auto">
                    <CardHeader>
                        <CardTitle>Reset Password</CardTitle>
                        <CardDescription>Enter your email or username to reset your password</CardDescription>
                    </CardHeader>
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <FormLabel htmlFor="resetInput">Email or Username</FormLabel>
                                    <CustomInput
                                        resetMethod={resetMethod}
                                        setResetMethod={setResetMethod}
                                        inputValue={inputValue}
                                        setInputValue={setInputValue}
                                    />

                                </div>
                            </CardContent>
                            <CardFooter>
                                <LoaderSubmitButton isSubmitting={formState.isSubmitting}>Send Reset
                                    Link</LoaderSubmitButton>
                            </CardFooter>
                        </form>
                    </Form> </Card>)
            }
            {email && (

                <>
                    <h1 className={"text-3xl tracking-tight"}>Please check your email and click on the verification
                        link
                        to <span className={"italic"}>reset</span> your password!</h1>
                    <div className={"flex gap-x-4 items-center"}>
                        <div className={"h-1 bg-secondary flex-grow"}></div>
                        <div className={""}>OR</div>
                        <div className={"h-1 bg-secondary flex-grow"}></div>
                    </div>
                    <Button className={"bg-blue-400 hover:bg-blue-600 w-fit self-center"}>
                        <Link className={""}
                              href={"/"}>
                            Go back to home page
                        </Link>
                    </Button>
                </>)
            }

        </div>
    )
}