"use client";

import DeleteGradeDialog from "@/components/dialogs/delete-grade-dialog";
import UpdateGradeDialog from "@/components/dialogs/update-grade-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Grade } from "@/types/grade";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

export default function GradeMoreButton({ grade }: { grade: Grade }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size="icon" variant="outline">
          <EllipsisVerticalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="flex flex-col items-start">
        {/* Update grade */}
        <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
          <UpdateGradeDialog gradeId={grade.id} />
        </DropdownMenuItem>

        {/* Delete grade */}
        <DropdownMenuItem
          asChild
          onSelect={(e) => e.preventDefault()}
        >
          <DeleteGradeDialog grade={grade} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
