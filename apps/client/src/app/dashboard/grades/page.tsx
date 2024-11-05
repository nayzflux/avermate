import GradesTable from "@/components/tables/grades-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

export default function GradesPage() {
  return (
    <main className="flex flex-col gap-8">
      <div className="flex gap-16 justify-between items-center">
        <h1 className="text-3xl font-semibold">Vos notes</h1>

        <Button>
          <PlusCircleIcon className="size-4 mr-2" />
          Ajouter une note
        </Button>
      </div>

      <Separator />

      <GradesTable />
    </main>
  );
}
