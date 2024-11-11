import MoreButton from "@/components/buttons/dashboard/more-button";
import AddGradeDialog from "@/components/dialogs/add-grade-dialog";
import GradesTable from "@/components/tables/grades-table";
import { Separator } from "@/components/ui/separator";

export default function GradesPage() {
  return (
    <main className="flex flex-col gap-8">
      <div className="flex gap-2 md:gap-16 justify-between items-center">
        <h1 className="text-xl md:text-3xl font-semibold">Vos notes</h1>

        <div className="flex gap-4">
          <AddGradeDialog />
          <MoreButton />
        </div>
      </div>

      <Separator />

      <GradesTable />
    </main>
  );
}
