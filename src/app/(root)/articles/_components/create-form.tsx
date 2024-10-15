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
import {CreateArticleSchemaClient,} from "@/lib/schemas/article";
import {createArticle} from "@/lib/articles/actions";
import {useToast} from "@/hooks/use-toast";
import {debounce} from "lodash"

import {validateSession} from "@/lib/auth/actions";
import {useTransition} from "react";
import {refreshArticles} from "@/app/actions";
import Previsualizer from "@/app/(root)/articles/_components/visualizer";
import {createSchemaClient} from "@/lib/schemas/article";


export default function CreateForm() {
    const router = useRouter()
    const {toast} = useToast()
    const form = useForm<CreateArticleSchemaClient>({
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

    }, 5000, {leading: true})
    const {getValues, watch, setError, handleSubmit, control, formState, register, setValue} = form
    const fileRef = register("featuredImage")
    const [ongoing, startTransition] = useTransition()

    const onSubmit: SubmitHandler<CreateArticleSchemaClient> = async ({title, content, excerpt, featuredImage}) => {
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

            setError("root", {message: message})
            toast({
                title: title,
                description: message ? message : undefined,
                variant: "destructive",
            })
            return;
        }



        toast({
            title: "Success",
            description: "New article has been created",
        })

        await refreshArticles()
        router.push("/")

    }
    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                        <FormLabel>Content</FormLabel>
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
                            <Input type="file" accept={".jpg,.jpeg,.png"} {...fileRef} />
                        </FormControl>
                        {/*{*/}
                        {/*    error*/}
                        {/*        ? (<FormDescription>Portrait of the article</FormDescription>)*/}
                        {/*        : <FormMessage />*/}
                        {/*}*/}
                        <FormMessage/>
                    </FormItem>
                }/>
                <div className={"flex flex-col items-start w-fit"}>
                    <div className={"border-2 rounded-lg p-4 w-[300px] h-[300px] flex flex-col items-center justify-center"}>
                        <Previsualizer watch={watch} />
                    </div>
                    <Button
                        type={"button"}
                        className={"border-2 border-red-400 hover:bg-red-600 transition-colors hover:text-white mt-2 self-end"}
                        onClick={() => setValue("featuredImage", null, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                        })}>
                        Delete
                    </Button>
                </div>
                <div className="flex justify-end gap-x-4">
                    <Button type="reset" onClick={() => form.reset({
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