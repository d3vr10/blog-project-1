"use client";
import {useRouter} from "next/navigation";
import {useToast} from "@/hooks/use-toast";
import {useEffect, useMemo, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {EditArticleSchemaClient, editSchemaClient} from "@/lib/schemas/article";
import {zodResolver} from "@hookform/resolvers/zod";
import {debounce} from "lodash";
import {validateSession} from "@/lib/auth/actions";
import {editArticle} from "@/lib/articles/actions";
import {refreshArticles} from "@/app/actions";
import EditComponent from "@/components/forms/articles/edit";
import dynamic from "next/dynamic";

export default function EditContainer(
    {
        title,
        excerpt,
        content,
        slug,
        featuredImage,
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

    const Editor = useMemo(
        () => dynamic(() => import("@/components/forms/articles/editor/editor"), {ssr: false}),
        [],
    )
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
        let fileData: null | undefined | FormData = values.featuredImage === null ? null : undefined
        if (values.featuredImage) {
            fileData = new FormData()
            fileData.set("file", values.featuredImage)
        }
        const editorContent = localStorage.getItem("editorContent") ?? ""
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
        toast({
            title: "Success",
            description: "Article has been updated",
        })

        await refreshArticles()
        router.push("/")

    }
    return <EditComponent
        form={form}
        onSubmit={onSubmit}
        featuredImageRef={featuredImageRef}
        Editor={Editor}
    />
}