"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

export const GetStartedButton = () => {
  const t = useTranslations("Landing.Headline");
  return (
    <div className="h-12 flex items-center justify-center">
      <Button size="default" asChild className="hidden sm:inline-flex">
        <Link href="/auth/sign-up">
          <ArrowRightIcon className="size-4 mr-2" />
          {t("getStarted")}
        </Link>
      </Button>
      <Button size="sm" asChild className="inline-flex sm:hidden">
        <Link href="/auth/sign-up">
          <ArrowRightIcon className="size-4 mr-2" />
          {t("getStarted")}
        </Link>
      </Button>
    </div>
  );
};
