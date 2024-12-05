import React from "react";
import {
  Card,
  CardContent,
} from "../ui/card";
import { TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function errorStateCard() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-6 p-6">
        <TriangleAlertIcon className="h-16 w-16" />
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Oops, something went wrong!</h1>
          <p className="text-gray-500 dark:text-gray-400">
            We're sorry, but it looks like there was an error. Please try again
            later or contact us if the issue persists.
          </p>
        </div>
        <Link href="/">
                  <Button>Go to Homepage</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
