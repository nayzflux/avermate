import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("ErrorPages.NotFound");

  return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <div className="absolute top-4 left-6">
        <Link className="flex gap-4 items-center " href={"/"}>
          <img className="size-8 rounded-lg" src="/logo.svg" alt="Logo" />
          Avermate
        </Link>
      </div>
      <Card className="w-[420px] max-w-[90%] border-none ">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">404</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-xl mb-4">{t("title")}</p>
          <p className="text-muted-foreground">
            {t("description")}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">{t("backToHome")}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}