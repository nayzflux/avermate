"use client";

import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { AddGradeForm } from "../forms/add-grade-form";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";

export default function AddGradeDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    // <div>
    //   <Dialog open={open} onOpenChange={setOpen}>
    //     <DialogTrigger asChild>
    //       <Button>
    //         <PlusCircleIcon className="size-4 mr-2" />
    //         Ajouter une note
    //       </Button>
    //     </DialogTrigger>

    //     <DialogContent>
    //       <DialogHeader>
    //         <DialogTitle>Ajouter une note</DialogTitle>
    //         <DialogDescription>
    //           Commencer à suivre votre évolution.
    //         </DialogDescription>
    //       </DialogHeader>

    //       <AddGradeForm close={() => setOpen(false)} />
    //     </DialogContent>
    //   </Dialog>
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>{children}</CredenzaTrigger>
      <CredenzaContent className="max-h-screen h-full ">
        <CredenzaHeader>
          <CredenzaTitle>Ajouter une note</CredenzaTitle>
          <CredenzaDescription>
            Commencer à suivre votre évolution.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="px-4 py-6 max-h-[100%] overflow-auto">
          <AddGradeForm close={() => setOpen(false)} />
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
    // </div>
  );
}
