import Link from "next/link";
import GradeValue from "./grade-value";

export default function RecentGradeItem() {
  return (
    <Link href="/dashboard/grades/a">
      <div className="flex items-center justify-between gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer rounded-lg p-2">
        <div className="flex flex-col gap-0.5">
          <p className="font-semibold">Maths</p>
          <p className="text-sm text-muted-foreground">
            DS 1 : Nombres complexes
          </p>
        </div>

        <GradeValue value={15} outOf={20} size="sm"/>
      </div>
    </Link>
  );
}
