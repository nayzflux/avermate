"use client";

import Avatar from "@/components/buttons/account/avatar";
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

export default function AvatarSection() {
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
              <Skeleton className="w-32 h-6" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="w-64 h-4" />
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <div className="flex mt-2">
              <Skeleton className="size-32 lg:size-64 rounded-full" />
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <ProfileSection title="Avatar" description="Change your avatar">
      <div className="flex mt-2">
        <Avatar
          className="size-32 lg:size-64"
          size={256}
          src={
            session?.user?.image ||
            `https://avatar.vercel.sh/${session?.user?.id}?size=256`
          }
        />
      </div>
    </ProfileSection>
  );
}
