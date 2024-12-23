"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import AddGradeDialog from "@/components/dialogs/add-grade-dialog";
import AddPeriodDialog from "@/components/dialogs/add-period-dialog";
import AddSubjectDialog from "@/components/dialogs/add-subject-dialog";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

export default function MobileAddButtons() {
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
          <AddGradeDialog>
            <Button variant="ghost" className="w-full justify-start">
              <PlusCircleIcon className="size-4 mr-2" />
              Ajouter une note
            </Button>
          </AddGradeDialog>
        </DropdownMenuItem>

        {/* Delete grade */}
        <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
          <AddSubjectDialog>
            <Button variant="ghost" className="w-full justify-start">
              <PlusCircleIcon className="size-4 mr-2" />
              Ajouter une matière
            </Button>
          </AddSubjectDialog>
        </DropdownMenuItem>

        <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
          <AddPeriodDialog>
            <Button variant="ghost" className="w-full justify-start">
              <PlusCircleIcon className="size-4 mr-2" />
              Ajouter une période
            </Button>
          </AddPeriodDialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
