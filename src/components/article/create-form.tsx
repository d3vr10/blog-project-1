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
import {
    CreateArticleSchemaClient,
    CreateArticleSchemaServer,
    createSchemaClient,
} from "@/lib/schemas/article";
import { createArticle } from "@/lib/articles/actions";
import { useToast } from "@/hooks/use-toast";
import { debounce, throttle } from "lodash"

import { ToastAction } from "@radix-ui/react-toast";
import { useAuth } from "../auth/context";
import { validateSession } from "@/lib/auth/actions";
import {useTransition} from "react";



export default function CreateForm() {
    const router = useRouter()
    const { toast } = useToast()
    const form = useForm<CreateArticleSchemaServer>({
        mode: "all",
        resolver: zodResolver(createSchemaClient),
        defaultValues: {
            content: "",
            excerpt: "",
            title: "",
            featuredImage: undefined,
        }
    })
    const onChangeFile = debounce(() => {

    }, 5000, { leading: true })

    const { setError, handleSubmit, control, formState, register } = form
    const fileRef = register("featuredImage")
    const [ongoing, startTransition] = useTransition()
    const onSubmit: SubmitHandler<CreateArticleSchemaClient> = async ({ title, content, excerpt, featuredImage }) => {
        const validResult = await validateSession()
        if (validResult.error) {
            toast({
                title: "Unauthorized",
                description: "Invalid session!",
                variant: "destructive",
            })
            router.push("/")
            return;
        }
        const formData = new FormData()
        if (featuredImage) {
            formData.set("file", featuredImage)
        }
        const createResult = await createArticle({
            title,
            content,
            excerpt,
            featuredImage: formData,
            userId: validResult.payload.id,
        })
        if (createResult.error) {
            let title = "Unknown Error"
            let message = "unknown error"
            if (createResult.status === 409) {
                message = "An article with this title already exists"
            }

            setError("root", { message: message })
            toast({
                title: title,
                description: message? message : undefined,
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
                                ? (<FormDescription>Excerpt of the article</FormDescription>)
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
                <FormField control={control} name="featuredImage" render={({ field, fieldState: { error } }) =>
                    <FormItem>
                        <FormLabel>Imagen de Portada</FormLabel>
                        <FormControl>
                            <Input type="file" accept={".jpg,.jpeg,.png"} {...fileRef} />
                        </FormControl>
                        {/*{*/}
                        {/*    error*/}
                        {/*        ? (<FormDescription>Portrait of the article</FormDescription>)*/}
                        {/*        : <FormMessage />*/}
                        {/*}*/}
                        <FormMessage />
                    </FormItem>
                } />
                <div className="flex justify-end gap-x-4">
                    <Button type="reset" onClick={() => form.reset({
                        title: "",
                        content: "",
                        excerpt: "",
                        featuredImage: null,
                    })}>Clear</Button>
                    <LoaderSubmitButton isSubmitting={formState.isSubmitting} />
                </div>
            </form>
        </Form >

    )
}