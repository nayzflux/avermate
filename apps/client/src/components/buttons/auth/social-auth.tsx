"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth";
import { env } from "@/lib/env";
import { FaGoogle, FaMicrosoft } from "react-icons/fa";

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

export default function SocialAuth() {
  async function handleSignIn(provider: "google" | "microsoft") {
    const data = await authClient.signIn.social({
      provider: provider,
      callbackURL: `${env.NEXT_PUBLIC_CLIENT_URL}/dashboard`,
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {providers.map(({ id, label, icon: Icon }) => (
        <Button key={id} variant="outline" onClick={() => handleSignIn(id)}>
          <Icon className="size-4 mr-2" />
          {label}
        </Button>
      ))}
    </div>
  );
}
