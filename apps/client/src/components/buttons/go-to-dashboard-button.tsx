"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "../ui/button";

export const GoToDashboardButton = () => {
  return (
    <>
      <Button size="default" asChild className="hidden sm:inline-flex">
        <Link href="/dashboard">
          <ArrowRightIcon className="size-4 mr-2" />
          Aller au tableau de bord
        </Link>
      </Button>
      <Button size="sm" asChild className="inline-flex sm:hidden">
        <Link href="/dashboard">
          <ArrowRightIcon className="size-4 mr-2" />
          Aller au tableau de bord
        </Link>
      </Button>
    </>
  );
};
