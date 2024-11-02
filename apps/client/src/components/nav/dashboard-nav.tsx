"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import path from "path";

const routes = [
  {
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    label: "Grades",
    path: "/dashboard/grades",
  },
  {
    label: "Graphs",
    path: "/dashboard/graphs",
  },
];

export default function DashboardNav() {
  const path = usePathname();

  return (
    <nav>
      <ul className="flex items-center">
        {routes.map((route) => (
          <Link key={route.path} href={route.path}>
            <li
              className={cn(
                "p-4 text-sm border-transparent hover:border-black dark:hover:border-white transition-all cursor-pointer",
                path === route.path
                  ? "dark:text-white text-black"
                  : "text-[#64748B]"
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
