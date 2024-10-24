"use client";
import {useRouter} from "next/navigation"
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import LoaderButton from "@/components/ui/loader-button";
import resetPassword from "@/app/(auth)/auth/forgot-password/actions";
import {useToast} from "@/hooks/use-toast";

const resetPasswordSchema = z.object({
    password: z.string().min(8),
    repeatPassword: z.string(),
}).refine((value) => {
    return value.password === value.repeatPassword
}, {message: "Both passwords must match!", path: ["repeatPassword"]})

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>

export default function Page() {
    const {toast} = useToast()
    const router = useRouter()
    const form = useForm<ResetPasswordSchema>({
        mode: "all",
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            repeatPassword: "",
        }
    })
    const {handleSubmit, formState} = form
    const onSubmit: SubmitHandler<ResetPasswordSchema> = async ({password}) => {
        const resetRes = await resetPassword(password)
        if (resetRes.error) {
            let title;
            let description;

            if (resetRes.status >= 500) {
                title = "Server Error"
                description = "Your password wasn't reset. Try again later."
            }
            if (resetRes.status > 404 && resetRes.status < 500) {
                title = "Invalid Token"
                description = "Check you didn't erase cookie data from this site. Redirecting you back..."
            }
            toast({
                title,
                description
            })
            setTimeout(() => router.push("/auth/forgot-password"), 1500)

            return;
        }

        toast({
            title: "Success",
            description: "Your password has been reset!",
        })

        setTimeout(() => router.push("/"), 1000)

    }
    return (
        <div
            className={"border-2 p-8 rounded-lg flex flex-column  xs:w-full sm:w-[320px] lg:w-[300px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"}>
            <Form {...form}>
                <form className={"w-full flex flex-col gap-y-4"} onSubmit={handleSubmit(onSubmit)}>
                    <FormField name="password" render={({field, fieldState}) => (
                        <FormItem className={"flex flex-col"}>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type={"password"} {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>


                    <FormField name="repeatPassword" render={({field, fieldState}) => (
                        <FormItem className={""}>
                            <FormLabel>Repeat Password</FormLabel>
                            <FormControl>
                                <Input type={"password"} {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>

                    <LoaderButton isSubmitting={formState.isSubmitting}>Reset</LoaderButton>
                </form>

            </Form>
        </div>
    )
}
