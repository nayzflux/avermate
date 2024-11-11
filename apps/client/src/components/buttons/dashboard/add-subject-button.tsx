import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

export default function AddSubjectButton() {
  return (
    <Button>
      <PlusCircleIcon className="size-4 mr-2" />
      Ajouter une note
    </Button>
  );
}
