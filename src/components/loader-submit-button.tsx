"use client";

import { Button } from "./ui/button";

export default function LoaderSubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
    return (
        <Button
            type="submit"
            disabled={isSubmitting}
            className="relative"
        >
            <span className={`inset-0 flex items-center justify-center transition-opacity duration-200 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                Submit
            </span>
            <span className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${isSubmitting ? 'opacity-100' : 'opacity-0'}`}>
                <div className="border-2 border-t-transparent h-5 w-5 animate-spin rounded-full"></div>
            </span>
        </Button>
    )
}