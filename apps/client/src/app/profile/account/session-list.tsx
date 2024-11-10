"use client";

import RevokeSessionButton from "@/components/buttons/revoke-session-button";
import { authClient, useSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ProfileSection from "../profile-section";

dayjs.extend(relativeTime);

type Session = {
  id: string;
  userId: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
};

export default function SessionList() {
  const { data: currentSession } = useSession();

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
    return <p>Loading...</p>;
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
              <RevokeSessionButton sessionId={session.id} />
            </div>
          </div>
        ))}
      </div>
    </ProfileSection>
  );
}