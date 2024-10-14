"use client";

import {UserCreateType, userCreateSchema} from "@/lib/schemas/user";
import {zodResolver} from "@hookform/resolvers/zod";
import {SubmitHandler, useForm} from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../../../components/ui/form";
import {Input} from "../../../components/ui/input";
import LoaderButton from "../../../components/loader-button";
import {Button} from "../../../components/ui/button";
import {signUp} from "@/lib/auth/actions";
import {useRouter} from "next/navigation";
import {useToast} from "@/hooks/use-toast";
import {useAuth} from "./context";


export default function SignupForm() {
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
    const {setError, formState, handleSubmit, control} = form
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
            variant: response.error? "destructive" : "default",
        })
        router.push("/")
    }
    return (
        <Form {...form}>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <FormField
                    name="email"
                    control={control}
                    render={({field, fieldState: {error}}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" {...field} />
                            </FormControl>
                            {
                                (!error)
                                    ? <FormDescription>Your email</FormDescription>
                                    : <FormMessage/>
                            }
                        </FormItem>
                    )}
                />
                <FormField
                    name="username"
                    control={control}
                    render={({field, fieldState: {error}}) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input type="text" {...field} />
                            </FormControl>
                            {
                                (!error)
                                    ? <FormDescription>Your username</FormDescription>
                                    : <FormMessage/>
                            }
                        </FormItem>
                    )}
                />
                <FormField
                    name="password"
                    control={control}
                    render={({field, fieldState: {error}}) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            {
                                (!error)
                                    ? <FormDescription>Your password</FormDescription>
                                    : <FormMessage/>
                            }
                        </FormItem>
                    )}
                />
                <FormField
                    name="repeatPassword"
                    control={control}
                    render={({field, fieldState: {error}}) => (
                        <FormItem>
                            <FormLabel>Repeat password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            {
                                (!error)
                                    ? <FormDescription>Repeat password</FormDescription>
                                    : <FormMessage/>
                            }
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-x-4 mt-4">
                    <Button onClick={() => form.reset()}>Reset</Button>
                    <LoaderButton isSubmitting={formState.isSubmitting}/>
                </div>

            </form>
        </Form>
    )
}