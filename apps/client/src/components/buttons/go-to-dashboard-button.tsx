"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "../ui/button";
import { useMediaQuery } from "../ui/use-media-query";

export const GoToDashboardButton = () => {
  const size = useMediaQuery("(min-width: 600px)") ? "default" : "sm";

  return (
    <Button size={size} asChild>
      <Link href="/dashboard">
        <ArrowRightIcon className="size-4 mr-2" />
        Aller au tableau de bord
      </Link>
    </Button>
  );
};
