"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "../ui/button";

export const GetStartedButton = () => {
  return (
    <>
      <Button size="default" asChild className="hidden sm:inline-flex">
        <Link href="/auth/sign-up">
          <ArrowRightIcon className="size-4 mr-2" />
          Commencer maintenant
        </Link>
      </Button>
      <Button size="sm" asChild className="inline-flex sm:hidden">
        <Link href="/auth/sign-up">
          <ArrowRightIcon className="size-4 mr-2" />
          Commencer maintenant
        </Link>
      </Button>
    </>
  );
};
