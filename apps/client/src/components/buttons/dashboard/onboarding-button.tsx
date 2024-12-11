import { Button } from "@/components/ui/button";
import { CursorArrowRippleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export const OnboardingButton = () => {
  return (
    <Button asChild>
      <Link href="/onboarding">
        <CursorArrowRippleIcon className="size-4 mr-2" />
        Configurer mon espace
      </Link>
    </Button>
  );
};
