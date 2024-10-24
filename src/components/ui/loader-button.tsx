"use client";

import {Button} from "./button";
import React from "react";

const LoaderButton = React.forwardRef(({isSubmitting, children, onClick, type}: {
    isSubmitting: boolean,
    children?: React.ReactNode,
    onClick?: () => void,
    type?: "button" | "submit"
}, ref) => {
    return (
        <Button
            type={type ? type : "submit"}
            disabled={isSubmitting}
            className="relative"
            onClick={onClick}
            ref={ref}
        >
            <span
                className={`inset-0 flex items-center justify-center transition-opacity duration-200 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                {children ? children : "Submit"}
            </span>
            <span
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${isSubmitting ? 'opacity-100' : 'opacity-0'}`}>
                <div className="border-2 border-t-transparent h-5 w-5 animate-spin rounded-full"></div>
            </span>
        </Button>
    )
})

export default LoaderButton;