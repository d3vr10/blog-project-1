"use client";

import {SubmitHandler, UseFormReturn} from "react-hook-form";
import {UserCreateType} from "@/lib/schemas/user";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import LoaderButton from "@/components/ui/loader-button";

export default function SignUpFormPresentation({form, onSubmit}: {
    form: UseFormReturn<UserCreateType>,
    onSubmit: SubmitHandler<UserCreateType>,
}) {
    const {control, handleSubmit, formState} = form
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