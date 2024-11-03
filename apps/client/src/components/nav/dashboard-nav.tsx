"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import path from "path";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

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
    <div>
      {/* New Navbar - visible on small screens */}
      <div className="md:hidden">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="dark:bg-zinc-800 bg-zinc-200">
                Navigation
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="flex flex-col p-4 gap-3">
                  {routes.map((route) => (
                    <Button
                      className={
                        path === route.path
                          ? "bg-zinc-700 dark:bg-zinc-500"
                          : ""
                      }
                    >
                      <Link href={route.path}>{route.label}</Link>
                    </Button>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <NavigationMenu className="hidden md:block">
        <NavigationMenuList>
          {routes.map((route) => (
            <NavigationMenuItem>
              <Link key={route.path} href={route.path} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    path === route.path
                      ? "dark:text-white text-black dark:bg-zinc-800 bg-zinc-100"
                      : "text-[#64748B] bg-transparent"
                  )}
                >
                  {route.label}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
