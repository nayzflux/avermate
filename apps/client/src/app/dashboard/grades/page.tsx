import MoreButton from "@/components/buttons/dashboard/more-button";
import AddGradeDialog from "@/components/dialogs/add-grade-dialog";
import AddPeriodDialog from "@/components/dialogs/add-period-dialog";
import AddSubjectDialog from "@/components/dialogs/add-subject-dialog";
import GradesTable from "@/components/tables/grades-table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

export default function GradesPage() {
  return (
    <main className="flex flex-col gap-8">
      <div className="flex gap-2 md:gap-16 justify-between items-center">
        <h1 className="text-xl md:text-3xl font-semibold">Vos notes</h1>

        <div className="flex gap-4">
          <AddGradeDialog />
          <AddSubjectDialog>
            <Button>
              <PlusCircleIcon className="size-4 mr-2" />
              Ajouter une matière
            </Button>
          </AddSubjectDialog>
          <AddPeriodDialog>
            <Button>
              <PlusCircleIcon className="size-4 mr-2" />
              Ajouter une période
            </Button>
          </AddPeriodDialog>
          {/* <MoreButton /> */}
        </div>
      </div>

      <Separator />

      <GradesTable />
    </main>
  );
}
