import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const authSchema = z.object({
    username: z.string().min(4),
    password: z.string().min(8),
})

export default function AuthForm() {
    const form = useForm({ mode: "all", resolver: zodResolver(authSchema) })
    return (
        <Form {...form}>
            <FormField
                name="username"
                render={(field) => (
                    <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                            <Input type="text" {...field} />
                        </FormControl>
                        <FormDescription>Tu nombre de usuario</FormDescription>
                    </FormItem>
                )}
            />
            <FormField
                name="password"
                render={(field) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>Tu contrasenna</FormDescription>
                    </FormItem>
                )}
            />

            <Button>Login</Button>

            <div className="flex justify-between items-center gap-x-4 my-4">
                <span className="h-[1px] flex-grow block bg-zinc-400"></span>
                <span className="text-sm">OR</span>
                <span className="h-[1px] flex-grow block bg-zinc-400"></span>

            </div>

                

        </Form>
    )
}