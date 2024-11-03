import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";
import Link from "next/link";
import subjects from "../../../../../subjects.json";
import GradeBadge from "./grade-badge";

export default function GradesTable() {
  return (
    <Table>
      <TableCaption>1er trimerstre</TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Matières</TableHead>

          <TableHead>Moyennes</TableHead>

          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {subjects.map((subject) => (
          <TableRow key={subject.id}>
            <TableCell
              className={cn(
                "font-medium",
                subject.parentId !== null && "text-right"
              )}
            >
              <Link
                href={`/dashboard/subjects/${subject.id}`}
                className="border-b border-dotted border-white"
              >
                {subject.name}
              </Link>
            </TableCell>

            <TableCell className="text-center font-semibold">14.38</TableCell>

            <TableCell>
              <div className="flex gap-4 flex-wrap">
                {Array.from({ length: Math.random() * 10 + 2 }).map(
                  (_, index) => (
                    <GradeBadge />
                  )
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Moyenne générale</TableCell>
          <TableCell className="text-right">14.38</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
