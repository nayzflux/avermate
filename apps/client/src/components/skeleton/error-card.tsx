import { TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export default function errorStateCard() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-6 p-6">
        <TriangleAlertIcon className="h-16 w-16" />
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">
            Oups, quelque chose s&apos;est mal passé !
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Nous sommes désolés, mais il semble qu&apos;il y ait eu une erreur.
            Veuillez réessayer plus tard ou contactez-nous si le problème
            persiste.
          </p>
        </div>
        <Link href="/">
          <Button>Retourner sur la page d&apos;acceuil</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
