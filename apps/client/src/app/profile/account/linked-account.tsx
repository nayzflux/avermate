"use client";

import { authClient } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import ProfileSection from "../profile-section";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Account = {
  id: string;
  provider: string;
};

export default function LinkedAccount() {
  const {
    data: accounts,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const accounts = (await authClient.listAccounts()) satisfies Account[];
      return accounts;
    },
  });

  if (isPending) return (
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
              <div
                className="flex flex-col gap-2 border-t text-sm px-2 pt-4"
              >
                <div className="flex gap-2">
                <p className="font-semibold">
                  <Skeleton className="w-20 h-6" />
                  </p>
                </div>

                <div className="flex justify-end"></div>
              </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );

  if (isError) return <p>Error!</p>;

  return (
    <ProfileSection
      title="Linked Accounts"
      description="List of all accounts linked to your user"
    >
      <div className="flex flex-col gap-4">
        {accounts?.map(({ id, provider }) => (
          <div
            key={id}
            className="flex flex-col gap-2 border-t text-sm px-2 pt-4"
          >
            <div className="flex gap-2">
              <p className="font-semibold">{provider}</p>
            </div>

            <div className="flex justify-end"></div>
          </div>
        ))}
      </div>
    </ProfileSection>
  );
}
