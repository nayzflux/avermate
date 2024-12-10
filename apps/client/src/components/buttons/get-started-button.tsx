"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "../ui/button";
import { useMediaQuery } from "../ui/use-media-query";

export const GetStartedButton = () => {
  const size = useMediaQuery("(min-width: 600px)") ? "default" : "sm";

  return (
    <Button size="sm" asChild>
      <Link href="/auth/sign-up">
        <ArrowRightIcon className="size-4 mr-2" />
        Commencer maintenant
      </Link>
    </Button>
  );
};
