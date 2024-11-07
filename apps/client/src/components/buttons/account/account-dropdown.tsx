"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth";
import {
  Cog6ToothIcon,
  LifebuoyIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { LuGithub } from "react-icons/lu";
import SignOutButton from "../sign-out-button";
import ThemeSwitchButton from "../theme-switch-button";
import Avatar from "./avatar";

export default function AccountDropdown() {
  const { data, isPending } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isPending}>
        <div className="p-2">
          {isPending ? (
            <Skeleton className="size-8 rounded-full" />
          ) : (
            <Avatar
              size={32}
              src={
                data?.user?.image ||
                `https://avatar.vercel.sh/${data?.user?.id}?size=32`
              }
            />
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mr-4">
        <DropdownMenuLabel className="flex gap-2 items-center">
          <Avatar
            size={32}
            src={
              data?.user?.image ||
              `https://avatar.vercel.sh/${data?.user?.id}?size=32`
            }
          />
          <div className="flex flex-col">
            <h1>{data?.user?.name}</h1>
            <p className="text-muted-foreground font-medium ">
              {data?.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserIcon className="size-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Cog6ToothIcon className="size-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ThemeSwitchButton />
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LuGithub className="size-4 mr-2" />
          Github
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LifebuoyIcon className="size-4 mr-2" />
          Support
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
