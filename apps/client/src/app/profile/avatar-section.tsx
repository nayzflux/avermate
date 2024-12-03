"use client";

import Avatar from "@/components/buttons/account/avatar";
import { authClient } from "@/lib/auth";
import ProfileSection from "./profile-section";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AvatarSection() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <Card className={"p-6 w-full"}>
        <div className="flex flex-col gap-6">
          <CardHeader className="p-0">
            <CardTitle>
              <Skeleton className="md:w-32 w-full h-6" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="md:w-64 w-full h-4" />
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
            // @ts-ignore
            session?.user?.image ||
            // @ts-ignore
            `https://avatar.vercel.sh/${session?.user?.id}?size=256`
          }
        />
      </div>
    </ProfileSection>
  );
}
