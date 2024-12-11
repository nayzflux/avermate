"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useMediaQuery } from "../ui/use-media-query";

export const DiscoverFeaturesButton = () => {
  const size = useMediaQuery("(min-width: 600px)") ? "default" : "sm";

  return (
    <Button size={size} variant="link" asChild>
      <Link href="#features">Découvrir les fonctionnalitées</Link>
    </Button>
  );
};
