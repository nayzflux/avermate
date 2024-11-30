"use client";

import { Label } from "@/components/ui/label";
import ProfileSection from "../profile-section";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Period } from "@/types/period";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import DeletePeriodDialog from "@/components/dialogs/delete-period-dialog";
import UpdatePeriodDialog from "@/components/dialogs/update-period-dialog";

export const PeriodsSection = () => {

    //Fetch period data
    const {
        data: period,
        isError: isPeriodError,
        isPending: isPeriodPending,
    } = useQuery({
        queryKey: ["periods"],
        queryFn: async () => {
            const res = await apiClient.get("periods");
            const data = await res.json<{ periods: Period[] }>();
            return data.periods;
        },
    });

  return (
    <ProfileSection title="Périodes" description="Gérez vos périodes scolaires">
      <div className="flex flex-col gap-4">
        {period?.map((period) => (
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
                  <DropdownMenuItem
                    asChild
                    onSelect={(e) => e.preventDefault()}
                  >
                    <UpdatePeriodDialog periodId={period.id} />
                  </DropdownMenuItem>

                  {/* Delete grade */}
                  <DropdownMenuItem
                    asChild
                    onSelect={(e) => e.preventDefault()}
                  >
                    <DeletePeriodDialog period={period} />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </ProfileSection>
  );
};
