import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeSwitchButton from "../theme-switch-button";
import Avatar from "./avatar";

export default function AccountDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="p-2">
          <Avatar
            size={32}
            src="https://avatar.vercel.sh/rauchg?size=32&text=NB"
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ThemeSwitchButton />
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500 hover:text-red-500 dark:hover:text-red-500">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
