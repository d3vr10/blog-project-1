"use client";

import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import {useState} from "react";
import SignInFormContainer from "@/components/forms/auth/SignInFormContainer";

export default function AuthDialogContainer() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog  onOpenChange={ () => setOpen((state) => !state) } open={open}>
      <DialogTrigger asChild className={""}>
        <Button variant="outline" className={"w-[105.4px] hover:bg-green-500 border-green-400"}>Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Who are you?</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <SignInFormContainer setOpen={setOpen} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
