"use client";

import {SubmitHandler, UseFormReturn} from "react-hook-form";
import {Dispatch, MutableRefObject, SetStateAction} from "react";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {AlertCircle, AtSign, ChevronDown, KeyIcon, User} from "lucide-react";
import {Input} from "@/components/ui/input";
import LoaderButton from "@/components/ui/loader-button";
import Link from "next/link";
import {GitHubIcon} from "@/components/icons";
import Image from "next/image";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {clsx} from "clsx";
import {AuthMethod, AuthSchemaType} from "@/components/forms/auth/SignInFormContainer";

export default function SignInFormPresentation({
                                                   form,
                                                   onSubmit,
                                                   formRef,
                                                   submitBtnRef,
                                                   signInMethod,
                                                   setSignInMethod,
                                                   setOpen,
                                               }: {
    form: UseFormReturn<AuthSchemaType>,
    onSubmit: SubmitHandler<AuthSchemaType>,
    formRef: MutableRefObject<HTMLFormElement | null>,
    submitBtnRef: MutableRefObject<HTMLButtonElement | null>,
    signInMethod: AuthMethod,
    setSignInMethod: Dispatch<SetStateAction<AuthMethod>>,
    setOpen: Dispatch<SetStateAction<boolean>>,

}) {
    const {handleSubmit, resetField, formState} = form
    return (
        <Form {...form}>
            <form className="flex flex-col gap-y-4" onSubmit={handleSubmit(onSubmit)} ref={formRef}
                  onKeyUp={(e) => {
                      e.preventDefault()
                      if (e.key.toUpperCase() === "ENTER")
                          submitBtnRef.current?.click()
                  }}>
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
                    type={"submit"}
                    ref={submitBtnRef}
                    isSubmitting={formState.isSubmitting}
                    onClick={() => {
                        if (signInMethod === "username") {
                            resetField("email")
                        } else if (signInMethod === "email") {
                            resetField("username")
                        }
                        formRef.current?.requestSubmit()
                    }}
                />

                {formState.errors.atLeastOne && (
                    <p className="text-sm font-medium text-destructive flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2"/>
                        {formState.errors.atLeastOne.message}
                    </p>
                )}

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

const CustomKeyInput = ({
                            signInMethod,
                            setSignInMethod
                        }: {
    signInMethod: AuthMethod,
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
                        <AuthMethodIcon method={signInMethod}/>
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

const AuthMethodIcon = ({method}: { method: AuthMethod }) => {
    return method === "email" ? <AtSign className="h-4 w-4"/> : <User className="h-4 w-4"/>
}
