import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { GetPeriodsResponse } from "@/types/get-periods-response";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import DeletePeriodDialog from "@/components/dialogs/delete-period-dialog";
import UpdatePeriodDialog from "@/components/dialogs/update-period-dialog";
import AddPeriodDialog from "@/components/dialogs/add-period-dialog";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import errorStateCard from "@/components/skeleton/error-card";

export default function Step1() {
  const {
    data: periods,
    isError: periodsIsError,
    isPending: periodsIsPending,
  } = useQuery({
    queryKey: ["periods"],
    queryFn: async () => {
      const res = await apiClient.get("periods");
      const data = await res.json<GetPeriodsResponse>();
      return data.periods;
    },
  });

  // if the period field is empty, we display a message explaining what periods are and how to create them (we also say that they are optional)
  if (!periods || periods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-primary">Périodes</h2>
        <p className="text-muted-foreground text-center">
          Les périodes sont des intervalles de temps qui vous permettent de
          regrouper vos notes. Vous pouvez les créer pour chaque année scolaire,
          semestre, trimestre, etc. Elles sont optionnelles. Si vous ne créez
          pas de périodes, toutes vos notes seront regroupées dans la même
          section.
        </p>
        <AddPeriodDialog>
          <Button variant="outline">
            <PlusCircleIcon className="size-4 mr-2" />
            Ajouter une période
          </Button>
        </AddPeriodDialog>
      </div>
    );
  }

  if (periodsIsPending) {
    return <div>Loading periods...</div>;
  }

  if (periodsIsError) {
    return errorStateCard();
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-primary">Vos Périodes</h2>
      {periods?.map((period) => (
        <div
          key={period.id}
          className="flex items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer rounded-lg p-2
              "
        >
          <div className="flex flex-col gap-1">
            <Label>{period.name}</Label>
            <span className="text-muted-foreground text-sm">
              Du {new Date(period.startAt).toLocaleDateString()} au{" "}
              {new Date(period.endAt).toLocaleDateString()}
            </span>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline">
                  <EllipsisVerticalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="flex flex-col items-start">
                {/* Update grade */}
                <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                  <UpdatePeriodDialog periodId={period.id} />
                </DropdownMenuItem>

                {/* Delete grade */}
                <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                  <DeletePeriodDialog period={period} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
      <div className="flex flex-col items-center justify-center space-y-4">
        <AddPeriodDialog>
          <Button variant="outline">
            <PlusCircleIcon className="size-4 mr-2" />
            Ajouter une nouvelle période
          </Button>
        </AddPeriodDialog>
      </div>
    </div>
  );
}
