import { TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useTranslations } from "next-intl";

export default function ErrorStateCard() {
  const t = useTranslations("Dashboard.EmptyStates.ErrorCard");

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-6 p-6">
        <TriangleAlertIcon className="h-16 w-16" />
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t("description")}</p>
        </div>
        <Link href="/">
          <Button>{t("backToHome")}</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
