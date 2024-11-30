"use client";

import DeleteSubjectDialog from "@/components/dialogs/delete-subject-dialog";
import UpdateSubjectDialog from "@/components/dialogs/update-subject-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Subject } from "@/types/subject";

export default function SubjectMoreButton({ subject }: { subject: Subject }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <EllipsisVerticalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="flex flex-col items-start">
        {/* Update grade */}
        <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
          <UpdateSubjectDialog subjectId={subject.id} />
        </DropdownMenuItem>

        {/* Delete grade */}
        <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
          <DeleteSubjectDialog subject={subject} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
