import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { GetSubjectsResponse } from "@/types/get-subjects-response";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  PlusCircleIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import AddSubjectDialog from "@/components/dialogs/add-subject-dialog";
import UpdateSubjectDialog from "@/components/dialogs/update-subject-dialog";
import DeleteSubjectDialog from "@/components/dialogs/delete-subject-dialog";
import { Subject } from "@/types/subject";
import { Badge } from "@/components/ui/badge";
import errorStateCard from "@/components/skeleton/error-card";
import ListPresetsDialog from "@/components/dialogs/list-presets-dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Step2() {
  const {
    data: subjects,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await apiClient.get("subjects");
      const data = await res.json<GetSubjectsResponse>();
      return data.subjects;
    },
  });

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-primary">Subjects</h2>
        <Table className="w-full table-auto hidden md:table">
          <TableCaption>
            <div className="flex w-full justify-center">
              <Skeleton className="w-64 h-[14px]" />
            </div>
          </TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] md:w-[200px]">
                <Skeleton className="w-full h-[18px]" />
              </TableHead>
              <TableHead className="w-[50px] md:w-[100px] text-center">
                <Skeleton className="w-full h-[18px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="w-full h-[18px]" />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 10 }, (_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="w-full h-[20px]" />
                </TableCell>
                <TableCell className="text-center font-semibold">
                  <Skeleton className="w-full h-[20px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-full h-[20px]" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table className="w-full table-auto md:hidden">
          <TableCaption>
            <div className="flex w-full justify-center">
              <Skeleton className="w-64 h-[14px]" />
            </div>
          </TableCaption>
          {/* No header on mobile */}
          <TableBody>
            {Array.from({ length: 5 }, (_, i) => i).map((item) => (
              <React.Fragment key={item}>
                {/* Subject + average row on mobile */}
                <TableRow className="border-b">
                  <TableCell className="w-full">
                    {/* Subject name skeleton */}
                    <Skeleton className="w-3/4 h-[20px] mb-1" />
                    {/* Mobile-only average skeleton */}
                    <Skeleton className="w-1/2 h-[14px]" />
                  </TableCell>
                </TableRow>

                {/* Notes row on mobile */}
                <TableRow className="border-b">
                  <TableCell className="w-full">
                    <div className="flex gap-2 flex-wrap pt-1 pb-2">
                      <Skeleton className="w-10 h-[20px]" />
                      <Skeleton className="w-10 h-[20px]" />
                      <Skeleton className="w-10 h-[20px]" />
                    </div>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (isError) {
    return errorStateCard();
  }

  if (!subjects || subjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-8">
        <h2 className="text-2xl font-bold text-primary">Matières</h2>
        <p className="text-muted-foreground text-center">
          <ul>
            <li>
              Les matières principales (ex. <b>Mathématiques</b>) apparaissent
              sur la page d&apos;accueil.
            </li>
            <li>
              Les catégories (ex. <b>&quot;Langues&quot;</b>) regroupent des
              matières sans moyenne propre.
            </li>
            <li>
              Les sous-matières (ex. <b>&quot;Écrit&quot;</b>,{" "}
              <b>&quot;Oral&quot;</b>) organisent les notes.
            </li>
          </ul>
        </p>
        <div className="flex md:flex-row flex-col items-center justify-center md:space-x-4 space-x-0 gap-2 md:gap-0">
          <AddSubjectDialog>
            <Button variant="outline">
              <PlusCircleIcon className="size-4 mr-2" />
              Ajouter une matière
            </Button>
          </AddSubjectDialog>
          <ListPresetsDialog>
            <Button>
              <PlusCircleIcon className="size-4 mr-2" />
              Ajouter des matières prédéfinies
            </Button>
          </ListPresetsDialog>
        </div>
      </div>
    );
  }

  const renderSubjects = (
    subjects: Subject[],
    parentId: string | null = null,
    level: number = 0
  ) =>
    subjects
      .filter((subject: Subject) => subject.parentId === parentId)
      .map((subject: Subject) => (
        <div
          key={subject.id}
          className={`${
            level > 0 ? "border-l-2 border-gray-300 pl-2 md:pl-4 " : ""
          }`}
        >
          <div className="flex md:flex-row md:items-center justify-between min-w-0 pb-4 gap-4">
            <div className="flex items-center space-x-2  flex-1 min-w-0">
              <span className="font-bold truncate">{subject.name}</span>
              {!subject.isDisplaySubject && (
                <span className="text-sm text-muted-foreground">
                  ({subject.coefficient / 100})
                </span>
              )}
              {subject.isMainSubject && (
                <>
                  <span className="hidden md:block text-xs text-blue-500">
                    Matière Principale
                  </span>
                  <Badge className="bg-blue-500 block md:hidden py-0 px-0 w-2 h-2 min-w-2" />
                </>
              )}
              {subject.isDisplaySubject && (
                <>
                  <span className="hidden md:block text-xs text-green-500">
                    Catégorie
                  </span>
                  <Badge className="bg-green-500 block md:hidden py-0 px-0 w-2 h-2 min-w-2" />
                </>
              )}
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <AddSubjectDialog parentId={subject.id}>
                <Button variant="outline" size="icon">
                  <PlusCircleIcon className="size-4" />
                </Button>
              </AddSubjectDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="outline">
                    <EllipsisVerticalIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <UpdateSubjectDialog subjectId={subject.id} />
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <DeleteSubjectDialog
                      subject={subject}
                      backOnDelete={false}
                    />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {renderSubjects(subjects, subject.id, level + 1)}
        </div>
      ));

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-primary">Subjects</h2>
      <div>{renderSubjects(subjects ?? [])}</div>
      <div className="flex flex-col items-center justify-center space-y-4">
        <AddSubjectDialog>
          <Button variant="outline">
            <PlusCircleIcon className="size-4 mr-2" />
            Ajouter une nouvelle matière
          </Button>
        </AddSubjectDialog>
      </div>
    </div>
  );
}
