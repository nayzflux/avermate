"use client";

import { UpdateNameForm } from "@/components/forms/profile/update-name-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth";
import { Session, User } from "better-auth/types";
import ProfileSection from "./profile-section";

export default function NameSection() {
  const { data: session, isPending } = authClient.useSession() as unknown as {
    data: { user: User; session: Session };
    isPending: boolean;
  };

  if (isPending) {
    return (
      <Card className={"p-6 w-full"}>
        <div className="flex flex-col gap-6">
          <CardHeader className="p-0">
            <CardTitle>
              <Skeleton className="w-36 h-6" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="w-20 h-4" />
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <div>
              <form className="flex flex-col gap-4">
                <div className="w-full">
                  <Skeleton className="w-full h-10" />
                </div>

                <div className="flex w-full justify-end">
                  <Button type="submit" variant="outline" disabled={isPending}>
                    Sauvegarder
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <ProfileSection
      title="Votre nom"
      description="Modifiez comment vous apparaissez sur Avermate."
    >
      <UpdateNameForm defaultName={session?.user?.name} />
    </ProfileSection>
  );
}
