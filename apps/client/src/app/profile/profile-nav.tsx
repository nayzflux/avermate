"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowLeftIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  UserIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    icon: UserIcon,
    label: "Profile",
    path: "/profile",
  },
  {
    icon: ShieldCheckIcon,
    label: "Compte & Sécutité",
    path: "/profile/account",
  },
  {
    icon: Cog6ToothIcon,
    label: "Paramètres",
    path: "/profile/settings",
  },
  {
    icon: InformationCircleIcon,
    label: "À propos",
    path: "/profile/about",
  },
  {
    icon: ArrowLeftIcon,
    label: "Retour",
    action: "back",
    path: "",
  },
];

export default function ProfileNav({ onBack }: { onBack: () => void }) {
  const path = usePathname();

  const filteredRoutes = routes.filter((route) => route.action !== "back");

  return (
    <nav>
      <ul className="flex flex-col gap-1 md:gap-4">
        {filteredRoutes.map((route) => (
          <li key={route.path}>
            <Button
              className={cn(
                "w-full justify-start items-center",
                path === route.path ? "bg-primary/10" : ""
              )}
              variant="ghost"
              asChild
            >
              <Link href={route.path}>
                <route.icon className="size-4 mr-0 lg:mr-2" />
                <p className="hidden lg:inline">{route.label}</p>
              </Link>
            </Button>
          </li>
        ))}
        {/* Always show the back button */}
        <li>
          <Button
            className="w-full justify-start items-center"
            variant="ghost"
            onClick={onBack}
          >
            <ArrowLeftIcon className="size-4 mr-0 lg:mr-2" />
            <p className="hidden lg:inline">Retour</p>
          </Button>
        </li>
      </ul>
    </nav>
  );
}
