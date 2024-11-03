import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";
import { BoxIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const providers = [
  {
    id: "google",
    label: "Google",
    icon: BoxIcon,
  },
  {
    id: "microsoft",
    label: "Microsoft",
    icon: BoxIcon,
  },
];

export default function SocialAuth() {
  return (
    <div className="flex flex-col gap-4">
      {providers.map(({ id, label, icon: Icon }) => (
        <Button key={id} variant="outline" asChild>
          <Link href={`${env.NEXT_PUBLIC_API_URL}auth/${id}`}>
            {/* <Icon className="size-4 mr-2" /> */}
            {label}
          </Link>
        </Button>
      ))}
    </div>
  );
}
