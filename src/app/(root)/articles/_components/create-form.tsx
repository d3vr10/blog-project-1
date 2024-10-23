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
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import LoaderButton from "@/components/loader-button";
import {useRouter} from "next/navigation";
import {CreateArticleSchemaClient,} from "@/lib/schemas/article";
import {createArticle} from "@/lib/articles/actions";
import {useToast} from "@/hooks/use-toast";
import {debounce} from "lodash"
import {validateSession} from "@/lib/auth/actions";
import {useEffect, useMemo, useRef, useTransition} from "react";
import {refreshArticles} from "@/app/actions";
import {createSchemaClient} from "@/lib/schemas/article";
import dynamic from "next/dynamic";
import Cover from "@/app/(root)/articles/_components/cover";
import {commitEditorMedia} from "@/lib/editor";
import {slugify} from "@/lib/utils";
import {BlockNoteEditor} from "@blocknote/core";

export default function CreateForm() {
    const Editor = useMemo(
        () => dynamic(() => import("@/components/editor"), {ssr: false}),
        [],
    )
    const editorRef = useRef<null | BlockNoteEditor>(null)
    const router = useRouter()
    const {toast} = useToast()
    const form = useForm<CreateArticleSchemaClient>({
        mode: "all",
        resolver: zodResolver(createSchemaClient),
        defaultValues: {
            excerpt: "",
            title: "",
            featuredImage: undefined,
        }
    })
    const onChangeFile = debounce(() => {

    }, 5000, {leading: true})
    const {getValues, watch, setError, handleSubmit, control, formState, register, setValue, getFieldState} = form
    const fileRef = register("featuredImage")
    const [ongoing, startTransition] = useTransition()
    useEffect(() => {
    }, []);

    const onSubmit: SubmitHandler<CreateArticleSchemaClient> = async ({title, excerpt, featuredImage}) => {
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

        const mvRes = await commitEditorMedia(editorRef.current as BlockNoteEditor, {
            username: validResult.payload.username,
            slug: slugify(title),
        })

        const editorContent = localStorage.getItem("editorContent") ?? null
        const createResult = await createArticle({
            title,
            content: editorContent,
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

        router.push("/")
        await refreshArticles()

    }
    return (
        <Form {...form}>
            <Cover watch={watch} fileInputRef={fileRef} fieldState={getFieldState("featuredImage")}/>
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
                <Editor editable={true} editorRef={editorRef}/>
                <div className="flex justify-end gap-x-4">
                    <Button type="reset" onClick={() => form.reset({
                        title: "",
                        excerpt: "",
                        featuredImage: undefined,
                    })}>Clear</Button>
                    <LoaderButton isSubmitting={formState.isSubmitting}/>
                </div>
            </form>
        </Form>

    )
}