"use client";

import { Grade } from "@/types/grade";
import Link from "next/link";
import GradeValue from "../grade-value";
import { usePathname } from "next/navigation";

export default function RecentGradeItem({ grade }: { grade: Grade }) {
  const pathname = usePathname();

const handleClick = () => {
    const currentPath = pathname + window.location.search || "/dashboard";
  localStorage.setItem("backFromGradeOrSubject", currentPath);
};
  return (
    <Link
      href={`/dashboard/grades/${grade.id}/${grade.periodId}`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer rounded-lg p-2 overflow-hidden min-w-0">
        <div className="flex flex-col gap-0.5 w-[80%] min-w-0 overflow-hidden">
          <p className="font-semibold truncate">{grade?.subject?.name}</p>
          <p className="text-sm text-muted-foreground truncate">{grade.name}</p>
        </div>
        <div className="w-[60px] flex-shrink-0 overflow-hidden">
          <GradeValue value={grade.value} outOf={grade.outOf} size="sm" />
        </div>
      </div>
    </Link>
  );
}
