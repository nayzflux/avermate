import { Grade } from "@/types/grade";
import Link from "next/link";
import GradeValue from "../grade-value";

export default function RecentGradeItem({ grade }: { grade: Grade }) {
  return (
    <Link href={`/dashboard/grades/${grade.id}`}>
      <div className="flex items-center justify-between gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer rounded-lg p-2">
        <div className="flex flex-col gap-0.5 w-[80%]">
          <p className="font-semibold">{grade?.subject?.name}</p>
          <p className="text-sm text-muted-foreground truncate">{grade.name}</p>
        </div>

        <GradeValue value={grade.value} outOf={grade.outOf} size="sm" />
      </div>
    </Link>
  );
}
