"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormDescription, FormControl } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import LoaderButton from "../loader-button";

export const createSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    excerpt: z.string().min(1),
    featuredImageURL: z.string().url().optional(),
})

export type CreateArticleSchema = z.infer<typeof createSchema>

export default function CreateForm() {
    const form = useForm<CreateArticleSchema>({ mode: "all", resolver: zodResolver(createSchema) })
    const { handleSubmit, control, formState } = form
    const onSubmit: SubmitHandler<CreateArticleSchema> = async ({ title, content, excerpt, featuredImageURL }) => {
        await new Promise((resolve) => setTimeout(() => resolve(null), 2000))
        alert("To be implemented...")
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
                    <LoaderButton isSubmitting={formState.isSubmitting} />
                </div>
            </form>
        </Form >

    )
}