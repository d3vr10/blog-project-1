"use client";

import {useEffect, useMemo, useRef, useTransition} from "react";
import dynamic from "next/dynamic";
import {BlockNoteEditor} from "@blocknote/core";
import {useRouter} from "next/navigation";
import {useToast} from "@/hooks/use-toast";
import {SubmitHandler, useForm} from "react-hook-form";
import {CreateArticleSchemaClient, createSchemaClient} from "@/lib/schemas/article";
import {zodResolver} from "@hookform/resolvers/zod";
import {debounce} from "lodash";
import {validateSession} from "@/lib/auth/actions";
import {commitEditorMedia} from "@/lib/editor";
import {slugify} from "@/lib/utils";
import {createArticle} from "@/lib/articles/actions";
import {refreshArticles} from "@/app/actions";
import CreateComponent from "@/components/forms/articles/create";

export default function CreateContainer() {

    const Editor = useMemo(
        () => dynamic(() => import("@/components/forms/articles/editor/editor"), {ssr: false}),
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
    const {setError, register} = form
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

        await refreshArticles()
        router.push("/")

    }

    return <CreateComponent
        onSubmit={onSubmit}
        form={form}
        editorRef={editorRef}
        fileRef={fileRef}
        Editor={Editor}
    />
}