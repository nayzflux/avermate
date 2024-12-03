"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export const ResetPasswordButton = () => {
  return (
    <Button asChild variant="link" className="text-muted-foreground" size="sm">
      <Link href="/auth/forgot-password">Forgot your password?</Link>
    </Button>
  );
};
