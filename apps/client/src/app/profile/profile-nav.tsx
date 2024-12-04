"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowLeftIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  UserIcon,
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
    label: "Account & Security",
    path: "/profile/account",
  },
  {
    icon: Cog6ToothIcon,
    label: "Settings",
    path: "/profile/settings",
  },
  {
    icon: ArrowLeftIcon,
    label: "Back",
    path: "/dashboard",
  },
];

export default function ProfileNav() {
  const path = usePathname();

  return (
    <nav>
      <ul className="flex flex-col gap-1 md:gap-4">
        {routes.map((route) => (
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
      </ul>
    </nav>
  );
}
