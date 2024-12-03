import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "../ui/button";

export const GoToDashboardButton = () => {
  return (
    <Button asChild>
      <Link href="/dashboard">
        <ArrowRightIcon className="size-4 mr-2" />
        Aller au tableau de bord
      </Link>
    </Button>
  );
};
