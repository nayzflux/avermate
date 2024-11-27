import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

export default function AddSubjectButton() {
  return (
    <Button variant="outline">
      <PlusCircleIcon className="size-4 mr-2" />
      Ajouter une matière
    </Button>
  );
}
