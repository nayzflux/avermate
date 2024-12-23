"use client";

import Link from "next/link";
import { Button } from "../ui/button";

export const DiscoverFeaturesButton = () => {
  return (
    <>
      <Button size="default" variant="link" asChild className="hidden sm:inline-block">
        <Link href="#features">Découvrir les fonctionnalitées</Link>
      </Button>
      <Button size="sm" variant="link" asChild className="sm:hidden">
        <Link href="#features">Découvrir les fonctionnalitées</Link>
      </Button>
    </>
  );
};
