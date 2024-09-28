"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormDescription, FormControl } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import clsx from "clsx";
import LoaderSubmitButton from "../loader-submit-button";
import { useRouter } from "next/navigation";
import { CreateArticleSchema, createSchema } from "@/lib/schemas/article";
import { createArticle } from "@/lib/articles/actions";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";



export default function CreateForm() {
    const router = useRouter()
    const { toast } = useToast()
    const form = useForm<CreateArticleSchema>({ mode: "all", resolver: zodResolver(createSchema) })
    const { setError, handleSubmit, control, formState } = form
    const onSubmit: SubmitHandler<CreateArticleSchema> = async ({ title, content, excerpt, featuredImageURL }) => {

        const result = await createArticle({
            title,
            content,
            excerpt,
            featuredImageURL,
        })
        if (result.error) {
            let message = ""
            if (result.status === 409)
                message = "An article with this title already exists"
            if (result.status === 401)
                message = "Invalid credentials"

            setError("root", { message: message })
            toast({
                title: "Authentication Error",
                description: message,
                variant: "destructive",
            })
            return;
        }
        
        toast({
            title: "Success",
            description: "New article has been created",
        })
        router.push("/")

    }
    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <FormField control={control} name="title" render={({ field, fieldState: { error } }) =>
                    <FormItem>
                        <FormLabel>{field.name[0].toUpperCase() + field.name.substring(1)}</FormLabel>
                        <FormControl>
                            <Input type="text" {...field} />
                        </FormControl>
                        {
                            error
                                ? (<FormDescription>Title of the article</FormDescription>)
                                : <FormMessage />
                        }
                    </FormItem>
                } />
                <FormField control={control} name="excerpt" render={({ field, fieldState: { error } }) =>
                    <FormItem>
                        <FormLabel>{field.name[0].toUpperCase() + field.name.substring(1)}</FormLabel>
                        <FormControl>
                            <Textarea {...field} />
                        </FormControl>
                        {
                            error
                                ? (<FormDescription>Title of the article</FormDescription>)
                                : <FormMessage />
                        }
                    </FormItem>
                } />
                <FormField control={control} name="content" render={({ field, fieldState: { error } }) =>
                    <FormItem>
                        <FormLabel>{field.name[0].toUpperCase() + field.name.substring(1)}</FormLabel>
                        <FormControl>
                            <Textarea {...field} />
                        </FormControl>
                        {
                            error
                                ? (<FormDescription>Content of the article</FormDescription>)
                                : <FormMessage />
                        }
                    </FormItem>
                } />
                <FormField control={control} name="featuredImageURL" render={({ field, fieldState: { error } }) =>
                    <FormItem>
                        <FormLabel>{field.name[0].toUpperCase() + field.name.substring(1)}</FormLabel>
                        <FormControl>
                            <Input type="file" {...field} />
                        </FormControl>
                        {
                            error
                                ? (<FormDescription>Title of the article</FormDescription>)
                                : <FormMessage />
                        }
                    </FormItem>
                } />
                <div className="flex justify-end gap-x-4">
                    <Button type="reset" onClick={() => form.reset({
                        title: "",
                        content: "",
                        excerpt: "",
                        featuredImageURL: "",
                    })}>Clear</Button>
                    <LoaderSubmitButton isSubmitting={formState.isSubmitting} />
                </div>
            </form>
        </Form >

    )
}