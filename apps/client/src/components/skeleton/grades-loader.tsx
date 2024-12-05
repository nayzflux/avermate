import React from "react";
import { Skeleton } from "../ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs } from "@/components/ui/tabs";

import { Button } from "../ui/button";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function gradesLoader() {
  return (
    <main className="flex flex-col gap-8">
      <div className="flex gap-2 md:gap-16 justify-between items-center">
        <h1 className="text-xl md:text-3xl font-semibold">
          <Skeleton className="w-40 h-[32px]" />
        </h1>

        <div className="flex gap-4">
          <Button disabled={true}>
            <PlusCircleIcon className="size-4 mr-2" />
            Ajouter une note
          </Button>

          <Button variant="outline" disabled={true}>
            <PlusCircleIcon className="size-4 mr-2" />
            Ajouter une matière
          </Button>
          <Button variant="outline" disabled={true}>
            <PlusCircleIcon className="size-4 mr-2" />
            Ajouter une période
          </Button>
        </div>
      </div>
      <Separator />

      {/* Statistiques */}
      <Tabs>
        <Table>
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
            {[...Array(10)].map((_, index) => (
              <TableRow key={index}>
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
      </Tabs>
    </main>
  );
}
