"use client";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SigninForm from "./signin-form";
import {useState} from "react";

export function AuthDialog() {
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
          <SigninForm setOpen={setOpen} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
