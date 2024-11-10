import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

export default function ProfileSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-6 w-full">
      <div className="flex flex-col gap-6">
        <CardHeader className="p-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent className="p-0">{children}</CardContent>
      </div>
    </Card>
  );
}