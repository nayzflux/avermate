"use client";

import UpdateGradeDialog from "@/components/dialogs/update-grade-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

export default function GradeMoreButton({ gradeId }: { gradeId: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size="icon" variant="outline">
          <EllipsisVerticalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* Update grade */}
        <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
          <UpdateGradeDialog gradeId={gradeId} />
        </DropdownMenuItem>

        {/* Delete grade */}
        {/* <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <AddPeriodDialog>
            <PlusCircleIcon className="size-4 mr-2" />
            Ajouter une période
          </AddPeriodDialog>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
