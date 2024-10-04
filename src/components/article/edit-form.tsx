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
import { CreateArticleSchemaClient, createSchemaClient } from "@/lib/schemas/article";
import { editArticle } from "@/lib/articles/actions";
import { useToast } from "@/hooks/use-toast";
import { debounce, throttle } from "lodash"

import { ToastAction } from "@radix-ui/react-toast";
import { useAuth } from "../auth/context";
import { validateSession } from "@/lib/auth/actions";
import {objectsKeyIntersectionDiff} from "@/lib/utils";



export default function EditForm(
    {
        title,
        excerpt,
        content,
        slug,
        featuredImage
    }
    : {
        title: string,
        excerpt: string,
        content: string,
        slug: string,
        featuredImage?: { name: string, base64Contents: string },
    }
) {
    const router = useRouter()
    const { toast } = useToast()
    const defaultValues = {
        content: content,
        excerpt: excerpt,
        title: title,
        featuredImage: featuredImage,
    }
    const form = useForm<CreateArticleSchemaClient>({
        mode: "all",
        resolver: zodResolver(createSchemaClient),
        defaultValues: defaultValues,
    })
    const onChangeFile = debounce(() => {

    }, 5000, { leading: true })
    const { setError, handleSubmit, control, formState, } = form
    const onSubmit: SubmitHandler<CreateArticleSchemaClient> = async (values) => {
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

        //Optimistic check on which values changed from the default ones.
        if (form.formState.isDirty) {
            const formData = new FormData()
            if (values.featuredImage){
                formData.set("file", values.featuredImage)
            }
            const editResult = await editArticle({
                featuredImage: formData,
                content: values.content,
                excerpt: values.excerpt,
                title: values.title,
                slug: slug
            });
            if (editResult.error) {
                let title = "Unknown Error"
                let message = "unknown error"
                if (editResult.status === 409) {
                    message = "An article with this title already exists"
                }

                setError("root", {message: message})
                toast({
                    title: title,
                    description: message ? message : undefined,
                    variant: "destructive",
                })
                return;
            }
        }

        toast({
            title: "Success",
            description: "Article has been updated",
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
                            <Input type="file" accept={".jpg,.jpeg,.png"} {...field} />
                        </FormControl>
                        {
                            error
                                ? (<FormDescription>Imagen de Portada</FormDescription>)
                                : <FormMessage />
                        }
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
