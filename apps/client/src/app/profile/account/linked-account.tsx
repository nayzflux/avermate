"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import ProfileSection from "../profile-section";
import errorStateCard from "@/components/skeleton/error-card";
import { Button } from "@/components/ui/button";
import { FaGoogle, FaMicrosoft } from "react-icons/fa";
import { KeyRoundIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

type Account = {
  id: string;
  provider: string;
};

const providers = [
  {
    id: "google",
    label: "Google",
    icon: FaGoogle,
  },
  {
    id: "microsoft",
    label: "Microsoft",
    icon: FaMicrosoft,
  },
] satisfies {
  id: "google" | "microsoft";
  label: string;
  icon: React.ComponentType;
}[];

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

  const { data: session, isPending: isPendingSession } =
    authClient.useSession();

  const [linkingProvider, setLinkingProvider] = useState<string | null>(null);

  const linkedProviders = new Set(accounts?.map((acc) => acc.provider));

  async function handleLinkAccount(provider: "google" | "microsoft") {
    try {
      setLinkingProvider(provider);
      await authClient.linkSocial({
        provider,
        callbackURL: `${location.origin}/profile/account`,
      });
    } catch (error) {
      console.error("Error linking account:", error);
    } finally {
      setLinkingProvider(null);
    }
  }

  if (isPending || isPendingSession)
    return (
      <Card className="p-6 w-full">
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
              <div className="flex flex-col gap-2 border-t text-sm px-2 pt-4">
                <div className="flex gap-2">
                  <p className="font-semibold">
                    <Skeleton className="w-20 h-6" />
                  </p>
                </div>
                <div className="flex justify-end"></div>
              </div>

              <div className="mt-4">
                <Skeleton className="w-32 h-6 mb-2" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );

  if (isError) return <div>{errorStateCard()}</div>;

  return (
    <ProfileSection
      title="Comptes Liés"
      description="Liste de tous les comptes liés à votre utilisateur"
    >
      <div className="flex flex-col ">
        <Separator />
        <div className="flex flex-col divide-y">
          {accounts?.map(({ id, provider }) => (
            <div
              key={id}
              className="flex flex-col gap-2 text-sm px-2 py-4 justify-center"
            >
              <div className="flex gap-2 ">
                <p className="font-semibold capitalize">{provider}</p>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Add Account Section */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold pb-4">
            Lier avec d&apos;autres services
          </h3>
          <div className="flex flex-col gap-2">
            {providers
              .filter(({ id }) => !linkedProviders.has(id))
              .map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  variant="outline"
                  onClick={() => handleLinkAccount(id)}
                  disabled={linkingProvider === id}
                >
                  <Icon className="mr-2" />
                  {linkingProvider === id
                    ? `Lien en cours avec ${label}...`
                    : `Lier ${label}`}
                </Button>
              ))}
            {!accounts.some((acc) => acc.provider === "credential") && (
              <Button variant="outline" asChild>
                <Link href="/auth/forgot-password" className="flex gap-2">
                  <KeyRoundIcon />
                  Lier avec Mot de Passe
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </ProfileSection>
  );
}
