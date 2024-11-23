"use client";

import AddSubjectDialog from "@/components/dialogs/add-subject-dialog";
import AddPeriodDialog from "@/components/dialogs/add-period-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EllipsisVerticalIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

export default function MoreButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size="icon" variant="outline">
          <EllipsisVerticalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <AddSubjectDialog>
            <PlusCircleIcon className="size-4 mr-2" />
            Ajouter une matière
          </AddSubjectDialog>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <AddPeriodDialog>
            <PlusCircleIcon className="size-4 mr-2" />
            Ajouter une période
          </AddPeriodDialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
