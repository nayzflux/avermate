"use client";

import { Button } from "@/components/ui/button";
export default function LandingPage() {
  return (
    <div>
      <Button
        onClick={() => {
          window.location.href = "/auth/sign-in";
        }}
      >
        Sign in
      </Button>
      <Button
        onClick={() => {
          window.location.href = "/auth/sign-up";
        }}
      >
        Sign up
      </Button>
      <Button
        onClick={() => {
          window.location.href = "/dashboard";
        }}
      >
        Dashboard
      </Button>
    </div>
  );
}
