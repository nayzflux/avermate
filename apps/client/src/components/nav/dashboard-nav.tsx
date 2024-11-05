"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuIndicator,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
//   NavigationMenuViewport,
// } from "@/components/ui/navigation-menu";

const routes = [
  {
    label: "Vue d'ensemble",
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
    // <div>
    //   {/* New Navbar - visible on small screens */}
    //   <div className="md:hidden">
    //     <NavigationMenu>
    //       <NavigationMenuList>
    //         <NavigationMenuItem>
    //           <NavigationMenuTrigger className="dark:bg-zinc-800 bg-zinc-200">
    //             Navigation
    //           </NavigationMenuTrigger>
    //           <NavigationMenuContent>
    //             <div className="flex flex-col p-4 gap-3">
    //               {routes.map((route) => (
    //                 <Button
    //                   className={
    //                     path === route.path
    //                       ? "bg-zinc-700 dark:bg-zinc-500"
    //                       : ""
    //                   }
    //                 >
    //                   <Link href={route.path}>{route.label}</Link>
    //                 </Button>
    //               ))}
    //             </div>
    //           </NavigationMenuContent>
    //         </NavigationMenuItem>
    //       </NavigationMenuList>
    //     </NavigationMenu>
    //   </div>

    //   <NavigationMenu className="hidden md:block">
    //     <NavigationMenuList>
    //       {routes.map((route) => (
    //         <NavigationMenuItem>
    //           <Link key={route.path} href={route.path} legacyBehavior passHref>
    //             <NavigationMenuLink
    //               className={cn(
    //                 navigationMenuTriggerStyle(),
    //                 path === route.path
    //                   ? "dark:text-white text-black dark:bg-zinc-800 bg-zinc-100"
    //                   : "text-[#64748B] bg-transparent"
    //               )}
    //             >
    //               {route.label}
    //             </NavigationMenuLink>
    //           </Link>
    //         </NavigationMenuItem>
    //       ))}
    //     </NavigationMenuList>
    //   </NavigationMenu>
    // </div>

    <nav className="sticky px-4 sm:px-16 lg:px-32 2xl:px-64 3xl:px-96 pt-4">
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
