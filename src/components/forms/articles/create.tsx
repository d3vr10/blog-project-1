"use client";

import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import LoaderButton from "@/components/ui/loader-button";
import Cover from "@/app/(root)/articles/_components/cover-container";
import {ComponentType, RefObject} from "react";
import {CreateArticleSchemaClient} from "@/lib/schemas/article";
import {SubmitHandler, UseFormRegisterReturn, UseFormReturn} from "react-hook-form";
import {BlockNoteEditor} from "@blocknote/core";

export default function CreateComponent({onSubmit, form, editorRef, fileRef, Editor}: {
    onSubmit: SubmitHandler<CreateArticleSchemaClient>,
    form: UseFormReturn<CreateArticleSchemaClient>,
    editorRef: RefObject<BlockNoteEditor | null>,
    fileRef: UseFormRegisterReturn<any>,
    Editor: ComponentType,
}) {
    const {getFieldState, watch, handleSubmit, control, formState} = form
    return (
        <Form {...form}>
            <Cover
                watch={watch}
                fileInputRef={fileRef}
                fieldState={getFieldState("featuredImage")}
                control={control}
            />
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