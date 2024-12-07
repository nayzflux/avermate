import { Separator } from "@/components/ui/separator";
import {
  ArrowLeftIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function gradeLoader() {
  return (
    <div className="flex flex-col gap-8 m-auto max-w-[2000px]">
      <div>
        <Button className="text-blue-600" variant="link" disabled>
          <ArrowLeftIcon className="size-4 mr-2" />
          Retour
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <Skeleton className="h-9 w-96" />

        <Button size="icon" variant="outline" disabled>
          <EllipsisVerticalIcon className="size-4" />
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3  gap-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <Card key={index} className="p-6 rounded-lg">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 justify-between">
                <Skeleton className="w-20 h-6" />
                <Skeleton className="w-6 h-6" />
              </div>

              <div className="flex flex-col gap-0.5">
                <Skeleton className="h-10" />

                <div className="text-xs text-muted-foreground font-light pt-2">
                  <Skeleton className="h-4 mb-1" />
                  <Skeleton className="w-20 h-4" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
