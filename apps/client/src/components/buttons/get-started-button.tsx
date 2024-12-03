import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "../ui/button";

export const GetStartedButton = () => {
  return (
    <Button asChild>
      <Link href="/auth/sign-up">
        <ArrowRightIcon className="size-4 mr-2" />
        Commencer maintenant
      </Link>
    </Button>
  );
};
