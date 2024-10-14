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
} from "../../../components/ui/form";
import {Input} from "../../../components/ui/input";
import {Textarea} from "../../../components/ui/textarea";
import {Button} from "../../../components/ui/button";
import LoaderButton from "../../../components/loader-button";
import {useRouter} from "next/navigation";
import {EditArticleSchemaClient, editSchemaClient} from "@/lib/schemas/article";
import {editArticle} from "@/lib/articles/actions";
import {useToast} from "@/hooks/use-toast";
import {debounce} from "lodash"
import {validateSession} from "@/lib/auth/actions";
import Image from "next/image";
import {useEffect, useState} from "react";
import {refreshArticles} from "@/app/actions";


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
    const {setError, handleSubmit, control, formState, register} = form
    const featuredImageFieldProps = register("featuredImage")
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
            const editResult = await editArticle({
                featuredImage: fileData,
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
                <FormField control={control} name="content" render={({field, fieldState: {error}}) =>
                    <FormItem>
                        <FormLabel>{field.name[0].toUpperCase() + field.name.substring(1)}</FormLabel>
                        <FormControl>
                            <Textarea {...field} />
                        </FormControl>
                        {
                            error
                                ? (<FormDescription>Content of the article</FormDescription>)
                                : <FormMessage/>
                        }
                    </FormItem>
                }/>
                <FormField control={control} name="featuredImage" render={({field, fieldState: {error}}) =>
                    <FormItem>
                        <FormLabel>Imagen de Portada</FormLabel>
                        <FormControl>
                            <Input type="file" accept={".jpg,.jpeg,.png"}  {...featuredImageFieldProps} onChange={handleonChangeFile} />
                        </FormControl>
                        {
                            error
                                ? (<FormDescription>Imagen de Portada</FormDescription>)
                                : <FormMessage/>
                        }
                    </FormItem>
                }/>

                <div id={"preview-box"} className={"flex flex-col items-start gap-y-4 w-fit"}>
                    <h4 className={""}>Preview</h4>
                    <div className={"border-2 rounded-lg border-solid border-muted w-fit p-4"}>
                        <div className={"w-[400px] h-[400px] flex flex-col justify-center"}>
                            { file? (
                                <>
                                    <Image src={URL.createObjectURL(file)} height={400} width={400} alt={"Tomate"}/>


                                </>

                            ) : ""}
                        </div>
                    </div>

                    <Button type={"button"} className={"hover:text-white hover:bg-red-600 self-end border-2 border-red-400 px-4 py-2 rounded-lg transition-colors"} onClick={() => {
                        setFile(null)
                    }}>Delete</Button>
                </div>

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