import AddSubjectDialog from "@/components/dialogs/add-subject-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function MoreButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size="icon"></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <AddSubjectDialog>
          <DropdownMenuItem>
            <PlusIcon className="size-4 mr-2" />
            Ajouter une matière
          </DropdownMenuItem>
        </AddSubjectDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
