import {SubmitHandler, UseFormReturn} from "react-hook-form";
import {Dispatch, MutableRefObject, SetStateAction} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormField, FormItem, FormLabel} from "@/components/ui/form";
import LoaderButton from "@/components/ui/loader-button";
import {AlertCircle, AtSign, ChevronDown, User} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {clsx} from "clsx";
import {Input} from "@/components/ui/input";
import {
    ForgotEmailSchema,
    ResetMethod
} from "@/components/forms/forgot-password/ForgotPasswordFormContainer";

const ResetMethodIcon = ({method}: { method: ResetMethod }) => {
    return method === "email" ? <AtSign className="h-4 w-4"/> : <User className="h-4 w-4"/>
}

const CustomInput = ({
                         resetMethod,
                         setResetMethod,
                     }: {
    resetMethod: ResetMethod,
    setResetMethod: (method: ResetMethod) => void,
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
                        "hidden": resetMethod === "email"
                    })
                }>
                    <Input
                        type={"text"}
                        placeholder={"Enter your username"}
                        className={`pl-24 ${fieldState.error ? "border-destructive" : ""}`}
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

export function ForgotPasswordFormPresentation(
    {
        sentEmail,
        onSubmit,
        form,
        formRef,
        submitBtnRef,
        resetMethod,
        setResetMethod,
    }:
        {
            sentEmail: boolean,
            onSubmit: SubmitHandler<ForgotEmailSchema>,
            form: UseFormReturn<ForgotEmailSchema>,
            formRef: MutableRefObject<HTMLFormElement | null>,
            submitBtnRef: MutableRefObject<HTMLButtonElement | null>,
            resetMethod: ResetMethod,
            setResetMethod: Dispatch<SetStateAction<ResetMethod>>,
        }
) {
    const {handleSubmit, formState, resetField} = form
    return (
        <>
            {!sentEmail && (
                <Card className="w-full mx-auto">
                    <CardHeader>
                        <CardTitle>Reset Password</CardTitle>
                        <CardDescription>Enter your email or username to reset your password</CardDescription>
                    </CardHeader>
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} ref={formRef} onKeyUp={(e) => {
                            e.preventDefault()
                            if (e.key.toUpperCase() === "ENTER")
                                submitBtnRef.current?.click()
                        }}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <FormLabel htmlFor="resetInput">Email or Username</FormLabel>
                                    <CustomInput
                                        resetMethod={resetMethod}
                                        setResetMethod={setResetMethod}
                                    />

                                </div>
                            </CardContent>
                            <CardFooter>
                                <LoaderButton
                                    ref={submitBtnRef}
                                    isSubmitting={formState.isSubmitting}
                                    onClick={() => {
                                        if (resetMethod === "username") {
                                            resetField("email")
                                        } else if (resetMethod === "email") {
                                            resetField("username")
                                        }
                                        formRef.current?.requestSubmit()
                                    }}
                                    type={"button"}
                                >
                                    Send Reset Link
                                </LoaderButton>

                                {formState.errors.atLeastOne && (
                                    <p className="text-sm font-medium text-destructive flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-2"/>
                                        {formState.errors.atLeastOne.message}
                                    </p>
                                )}
                            </CardFooter>
                        </form>
                    </Form> </Card>)
            }
            {sentEmail && (

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
                              href={"/public"}>
                            Go back to home page
                        </Link>
                    </Button>
                </>)
            }

        </>
    )
}