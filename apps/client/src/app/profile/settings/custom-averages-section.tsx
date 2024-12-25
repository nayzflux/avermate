"use client";

import AddAverageDialog from "@/components/dialogs/add-average-dialog";
import DeleteAverageDialog from "@/components/dialogs/delete-average-dialog";
import UpdateAverageDialog from "@/components/dialogs/update-average-dialog";
import errorStateCard from "@/components/skeleton/error-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubjects } from "@/hooks/use-subjects";
import { apiClient } from "@/lib/api";
import { GetCustomAveragesResponse } from "@/types/get-custom-averages-response";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { BookOpenIcon, PlusCircleIcon } from "lucide-react";
import ProfileSection from "../profile-section";

export const CustomAveragesSection = () => {
  //Fetch period data
  // const {
  //   data: averages,
  //   isError: isAveragesError,
  //   isPending: isAveragesPending,
  // } = useSubjects();

  const {
    data: averages,
    isError: isAveragesError,
    isPending: isAveragesPending,
  } = useQuery({
    queryKey: ["customAverages"],
    queryFn: async () => {
      const res = await apiClient.get("averages");
      const data = await res.json<GetCustomAveragesResponse>();
      return data.customAverages;
    },
  });

  const {
    data: subjects,
    isError: isSubjectsError,
    isPending: isSubjectsPending,
  } = useSubjects();

  if (isAveragesPending || isSubjectsPending) {
    return (
      <Card className={"p-6 w-full"}>
        <div className="flex flex-col gap-6">
          <CardHeader className="p-0">
            <CardTitle>
              <Skeleton className="w-36 h-6" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="w-20 h-4" />
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <div className="flex flex-col gap-4">
              {Array.from({ length: 1 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer rounded-lg p-2
              "
                >
                  <div className="flex flex-col gap-1 w-full">
                    <Label>
                      <Skeleton className="md:w-64 h-6" />
                    </Label>
                    <span className="text-muted-foreground text-sm">
                      <Skeleton className="w-full md:w-32 h-4" />
                    </span>
                  </div>
                  <div>
                    <Button size="icon" variant="outline" disabled>
                      <EllipsisVerticalIcon className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex justify-start">
                <AddAverageDialog>
                  <Button disabled>
                    <PlusCircleIcon className="size-4 mr-2" />
                    Ajouter une moyenne personnalisée
                  </Button>
                </AddAverageDialog>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  if (isAveragesError || isSubjectsError) {
    return <div>{errorStateCard()}</div>;
  }

  if (averages.length == 0) {
    return (
      <ProfileSection
        title="Moyennes personnalisées"
        description="Gérez vos moyennes personnalisées"
      >
        <div className="flex flex-col gap-4 justify-center items-center ">
          <BookOpenIcon className="w-12 h-12" />
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-xl font-semibold text-center">
              Aucune moyenne personnalisée pour l&apos;instant
            </h2>
            <p className="text-center">
              Ajouter une nouvelle moyenne personnalisée
            </p>
          </div>
          <AddAverageDialog>
            <Button variant="outline">
              <PlusCircleIcon className="size-4 mr-2" />
              Ajouter une moyenne personnalisée
            </Button>
          </AddAverageDialog>
        </div>
      </ProfileSection>
    );
  }

  return (
    <ProfileSection
      title="Moyennes personnalisées"
      description="Gérez vos moyennes personnalisées"
    >
      <div className="flex flex-col gap-4">
        {averages?.map((average) => (
          <div
            key={average.id}
            className="flex items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer rounded-lg p-2
              "
          >
            <div className="flex flex-col gap-1">
              <Label>{average.name}</Label>
              <span className="text-muted-foreground text-sm">
                {average.subjects
                  .map(
                    (subjectId) =>
                      subjects?.find((subject) => subject.id === subjectId.id)
                        ?.name
                  )
                  .filter(Boolean)
                  .join(" / ")}
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
                    <UpdateAverageDialog averageId={average.id} />
                  </DropdownMenuItem>

                  {/* Delete grade */}
                  <DropdownMenuItem
                    asChild
                    onSelect={(e) => e.preventDefault()}
                  >
                    <DeleteAverageDialog average={average} />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
        <div className="flex justify-start">
          <AddAverageDialog>
            <Button>
              <PlusCircleIcon className="size-4 mr-2" />
              Ajouter une moyenne personnalisée
            </Button>
          </AddAverageDialog>
        </div>
      </div>
    </ProfileSection>
  );
};
