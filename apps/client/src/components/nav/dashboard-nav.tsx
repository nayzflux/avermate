"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: "Overview",
    path: "/dashboard",
  },
  {
    label: "Notes",
    path: "/dashboard/grades",
  },
];

export default function DashboardNav() {
  const path = usePathname();

  return (
    <nav className="sticky px-4 sm:px-16 lg:px-32 xl:px-64 2xl:px-96">
      <ul className="flex items-center border-b">
        {routes.map((route) => (
          <Link key={route.path} href={route.path}>
            <li
              className={cn(
                "p-4 text-sm border-b-2 border-transparent hover:border-black dark:hover:border-white transition-all",
                path === route.path && "border-black dark:border-white"
              )}
            >
              {route.label}
            </li>
          </Link>
        ))}
      </ul>
    </nav>
  );
}
