"use client";

import RevokeSessionButton from "@/components/buttons/revoke-session-button";
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
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ProfileSection from "../profile-section";

dayjs.extend(relativeTime);

type Session = {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  token: string;
  ipAddress?: string | null | undefined;
  userAgent?: string | null | undefined;
};

export default function SessionList() {
  const { data: currentSession } = authClient.useSession() as unknown as {
    data: { session: Session };
  };

  const {
    data: sesssions,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["sessions-list"],
    queryFn: async () => {
      const sessions = (await authClient.listSessions()) satisfies Session[];
      return sessions;
    },
  });

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
            <div className="flex flex-col gap-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 border-t text-sm px-2 pt-4"
                >
                  <div className="flex gap-2">
                    <p className="font-semibold">
                      <Skeleton className="w-32 h-6" />
                    </p>
                  </div>

                  <div className="flex gap-1 text-muted-foreground">
                    <p>
                      <Skeleton className="w-96 h-4" />
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="destructive" disabled>
                      Revoke
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  if (isError) {
    return <p>Error!</p>;
  }

  return (
    <ProfileSection
      title="Active Sessions"
      description="Manage and watch all your active sessions."
    >
      <div className="flex flex-col gap-4">
        {sesssions?.map((session) => (
          <div
            key={session.id}
            className="flex flex-col gap-2 border-t text-sm px-2 pt-4"
          >
            <div className="flex gap-2">
              <p className="font-semibold">{session.id.substring(0, 10)}</p>

              <p className="text-muted-foreground">
                {dayjs(session.expiresAt).fromNow()}
              </p>

              {/* Fix spaghetti code */}
              <span
                className={cn(
                  "items-center px-2 py-1 rounded bg-opacity-30 text-xs",
                  session.expiresAt < new Date()
                    ? "bg-red-600 text-red-500 border-red-500"
                    : currentSession?.session?.id === session.id
                    ? "bg-green-600 text-green-600 border-green-500"
                    : "bg-blue-600 text-blue-600 border-blue-500"
                )}
              >
                {currentSession?.session?.id === session.id ? (
                  <p>Current</p>
                ) : session.expiresAt < new Date() ? (
                  <p>Expired</p>
                ) : (
                  <p>Active</p>
                )}
              </span>
            </div>

            <div className="flex gap-1 text-muted-foreground">
              {session.userAgent && <p>{session.userAgent}</p>}
              {session.ipAddress && <p>{session.ipAddress}</p>}
            </div>

            <div className="flex justify-end">
              <RevokeSessionButton
                sessionId={session.id}
                sessionToken={session.token}
              />
            </div>
          </div>
        ))}
      </div>
    </ProfileSection>
  );
}
