"use client";

import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { useState } from "react";
import { AddGradeForm } from "../forms/add-grade-form";

export default function AddGradeDialog({
  children,
  parentId,
}: {
    children: React.ReactNode;
    parentId?: string;
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
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Ajouter une note</CredenzaTitle>
          <CredenzaDescription>
            Commencer à suivre votre évolution.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="px-4 py-6 max-h-[100%] overflow-auto">
          <AddGradeForm close={() => setOpen(false)} parentId={parentId} />
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
    // </div>
  );
}
