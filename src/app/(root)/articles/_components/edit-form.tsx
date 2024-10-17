"use client";

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
} from "../../../../components/ui/form";
import {Input} from "../../../../components/ui/input";
import {Textarea} from "../../../../components/ui/textarea";
import {Button} from "../../../../components/ui/button";
import LoaderButton from "../../../../components/loader-button";
import {useRouter} from "next/navigation";
import {EditArticleSchemaClient, editSchemaClient} from "@/lib/schemas/article";
import {editArticle} from "@/lib/articles/actions";
import {useToast} from "@/hooks/use-toast";
import {debounce} from "lodash"
import {validateSession} from "@/lib/auth/actions";
import {useEffect, useState} from "react";
import {refreshArticles} from "@/app/actions";
import Cover from "@/app/(root)/articles/_components/cover";
import dynamic from "next/dynamic";

const Editor = dynamic(()=>import("@/components/editor"), { ssr: false })


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
        featuredImage?: {
            name: string,
            base64Contents: string,
        }
    }
) {
    const router = useRouter()
    const {toast} = useToast()
    const [file, setFile] = useState<File | undefined | null>(undefined)
    useEffect(() => {

        if (featuredImage) {
            const binaryString = atob(featuredImage.base64Contents)
            const bytes = new Uint8Array(binaryString.length)
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i)
            }
            setFile(
                new File(
                    [new Blob([bytes as BlobPart], {type: "image/" + featuredImage.name.split(".")[1]})],
                    featuredImage.name,
                    {type: "image/" + featuredImage.name.split(".")[1]}
                )
            )


        }
    }, []);

    let defaultValues = {
        content,
        title,
        excerpt,
        featuredImage: file
    }
    const form = useForm<EditArticleSchemaClient>({
        mode: "all",
        resolver: zodResolver(editSchemaClient),
        defaultValues: defaultValues,
    })

    const handleonChangeFile = debounce((e) => {
        const [file] = e.target.files
        setFile(file)

    }, 5000, {leading: true})
    const {setError, handleSubmit, control, formState, register, watch} = form
    const featuredImageRef = register("featuredImage")
    const onSubmit: SubmitHandler<EditArticleSchemaClient> = async (values) => {
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
        //if (formState.isDirty) {
            let fileData: null | undefined | FormData = values.featuredImage === null? null : undefined
            if (values.featuredImage) {
                fileData = new FormData()
                fileData.set("file", values.featuredImage)
            }
            const editorContent = localStorage.getItem("editorContent")?? ""
            const editResult = await editArticle({
                featuredImage: fileData,
                content: editorContent,
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
        //}

        await refreshArticles()
        router.refresh()

        toast({
            title: "Success",
            description: "Article has been updated",
        })
        router.push("/")
        router.refresh()

    }
    return (
        <Form {...form}>
            <Cover fileInputRef={featuredImageRef} watch={watch} fieldState={form.getFieldState("featuredImage")} />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <h1 className={"text-5xl font-bold"}>Edit Article</h1>

                <FormField control={control} name="title" render={({field, fieldState: {error}}) =>
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input type="text" {...field} />
                        </FormControl>
                        {
                            error
                                ? (<FormDescription>Title of the article</FormDescription>)
                                : <FormMessage/>
                        }
                    </FormItem>
                }/>
                <FormField control={control} name="excerpt" render={({field, fieldState: {error}}) =>
                    <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                            <Textarea {...field} />
                        </FormControl>
                        {
                            error
                                ? (<FormDescription>Excerpt of the article</FormDescription>)
                                : <FormMessage/>
                        }
                    </FormItem>
                }/>
                <Editor editable={true} />


                <div className="flex justify-end gap-x-3">
                    <Button type="button" onClick={() => form.reset({
                        title: "",
                        content: "",
                        excerpt: "",
                        featuredImage: undefined,
                    })}>Clear</Button>
                    <LoaderButton isSubmitting={formState.isSubmitting}/>
                </div>
            </form>
        </Form>

    )
}