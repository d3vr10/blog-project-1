"use client";

import {SubmitHandler, UseFormRegisterReturn, UseFormReturn} from "react-hook-form";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "../../ui/form";
import {Input} from "../../ui/input";
import {Textarea} from "../../ui/textarea";
import {Button} from "../../ui/button";
import LoaderButton from "../../ui/loader-button";
import {EditArticleSchemaClient} from "@/lib/schemas/article";
import {ComponentType} from "react";
import Cover from "@/app/(root)/articles/_components/cover";


export default function EditComponent(
    {
        featuredImageRef,
        onSubmit,
        form,
        Editor,
    }
        : {
        featuredImageRef: UseFormRegisterReturn<any>,
        onSubmit: SubmitHandler<EditArticleSchemaClient>,
        form: UseFormReturn<EditArticleSchemaClient>,
        Editor: ComponentType,
    }
) {
    const {watch, control, formState, handleSubmit} = form;
    return (
        <Form {...form}>
            <Cover fileInputRef={featuredImageRef} watch={watch} fieldState={form.getFieldState("featuredImage")}/>
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
                <Editor editable={true}/>


                <div className="flex justify-end gap-x-3">
                    <Button type="button" onClick={() => form.reset({
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