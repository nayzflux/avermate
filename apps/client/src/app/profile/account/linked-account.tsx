"use client";

import { authClient } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import ProfileSection from "../profile-section";

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

  if (isPending) return <p>Loading...</p>;

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
