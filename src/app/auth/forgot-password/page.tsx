"use client";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {KeyIcon, KeyRoundIcon} from "lucide-react";
import {SubmitHandler, useForm} from "react-hook-form";
import z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {generateForgotPasswordToken} from "@/app/auth/forgot-password/actions";
import {toast} from "@/hooks/use-toast";
import LoaderSubmitButton from "@/components/loader-submit-button";

const forgotEmailSchema = z.object({
    email: z.string().email()
})
type ForgotEmailSchema = z.infer<typeof forgotEmailSchema>

export default  function Page() {
    const [emailProvided, setEmailProvided] = useState(false);
    const form = useForm<ForgotEmailSchema>({
        resolver: zodResolver(forgotEmailSchema),
        mode: "all",
        defaultValues: {
            email: "",
        }
    });
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
        setEmailProvided(true)
    }
    return (
        <div
            className={"absolute top-1/2 border-2 rounded-lg p-6 flex flex-col gap-y-4 left-1/2 -translate-y-1/2 -translate-x-1/2 w-4/5 md:w-2/4 xl:w-1/6 "}>
            {!emailProvided && (
                <>
                    <div className={"p-4 rounded-full border-2 w-fit mx-auto"}><KeyRoundIcon className={""}/></div>
                    <div>
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className={"flex-col flex gap-y-4"}>
                                <FormField name={"email"} render={({field, fieldState}) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <LoaderSubmitButton isSubmitting={formState.isSubmitting}/>
                            </form>
                        </Form>
                    </div>
                </>
            )}
            {emailProvided && (
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