"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import ThemeSwitchButton from "../theme-switch-button";
import Avatar from "./avatar";
import { useTheme } from "next-themes";

export default function AccountDropdown() {

  const { resolvedTheme } = useTheme();

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

      <DropdownMenuContent className="mt-2 mr-2">
        <DropdownMenuLabel className="flex gap-2 items-center">
          {" "}
          <Avatar
            size={32}
            src="https://avatar.vercel.sh/rauchg?size=32&text=NB"
            className="h-8"
          />
          <div className="flex flex-col">
          <h1>My Account</h1>
            <p className="text-muted-foreground font-medium ">(emailadress@example.com)</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.6663 14V12.6667C12.6663 11.9594 12.3854 11.2811 11.8853 10.781C11.3852 10.281 10.7069 10 9.99967 10H5.99967C5.29243 10 4.61415 10.281 4.11406 10.781C3.61396 11.2811 3.33301 11.9594 3.33301 12.6667V14M10.6663 4.66667C10.6663 6.13943 9.47243 7.33333 7.99967 7.33333C6.52692 7.33333 5.33301 6.13943 5.33301 4.66667C5.33301 3.19391 6.52692 2 7.99967 2C9.47243 2 10.6663 3.19391 10.6663 4.66667Z"
              stroke={resolvedTheme === "dark" ? "#FAFAFA" : "#09090B"}
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.14667 1.33337H7.85333C7.49971 1.33337 7.16057 1.47385 6.91053 1.7239C6.66048 1.97395 6.52 2.31309 6.52 2.66671V2.78671C6.51976 3.02052 6.45804 3.25017 6.34103 3.4526C6.22401 3.65503 6.05583 3.82313 5.85333 3.94004L5.56667 4.10671C5.36398 4.22373 5.13405 4.28534 4.9 4.28534C4.66595 4.28534 4.43603 4.22373 4.23333 4.10671L4.13333 4.05337C3.82738 3.87688 3.46389 3.829 3.12267 3.92025C2.78145 4.01149 2.49037 4.2344 2.31333 4.54004L2.16667 4.79337C1.99018 5.09933 1.9423 5.46282 2.03354 5.80404C2.12478 6.14526 2.34769 6.43634 2.65333 6.61337L2.75333 6.68004C2.95485 6.79638 3.12241 6.96343 3.23937 7.16459C3.35632 7.36576 3.4186 7.59402 3.42 7.82671V8.16671C3.42093 8.40165 3.35977 8.63268 3.2427 8.83638C3.12563 9.04008 2.95681 9.20924 2.75333 9.32671L2.65333 9.38671C2.34769 9.56374 2.12478 9.85482 2.03354 10.196C1.9423 10.5373 1.99018 10.9008 2.16667 11.2067L2.31333 11.46C2.49037 11.7657 2.78145 11.9886 3.12267 12.0798C3.46389 12.1711 3.82738 12.1232 4.13333 11.9467L4.23333 11.8934C4.43603 11.7763 4.66595 11.7147 4.9 11.7147C5.13405 11.7147 5.36398 11.7763 5.56667 11.8934L5.85333 12.06C6.05583 12.1769 6.22401 12.3451 6.34103 12.5475C6.45804 12.7499 6.51976 12.9796 6.52 13.2134V13.3334C6.52 13.687 6.66048 14.0261 6.91053 14.2762C7.16057 14.5262 7.49971 14.6667 7.85333 14.6667H8.14667C8.50029 14.6667 8.83943 14.5262 9.08948 14.2762C9.33953 14.0261 9.48 13.687 9.48 13.3334V13.2134C9.48024 12.9796 9.54196 12.7499 9.65898 12.5475C9.77599 12.3451 9.94418 12.1769 10.1467 12.06L10.4333 11.8934C10.636 11.7763 10.866 11.7147 11.1 11.7147C11.3341 11.7147 11.564 11.7763 11.7667 11.8934L11.8667 11.9467C12.1726 12.1232 12.5361 12.1711 12.8773 12.0798C13.2186 11.9886 13.5096 11.7657 13.6867 11.46L13.8333 11.2C14.0098 10.8941 14.0577 10.5306 13.9665 10.1894C13.8752 9.84815 13.6523 9.55707 13.3467 9.38004L13.2467 9.32671C13.0432 9.20924 12.8744 9.04008 12.7573 8.83638C12.6402 8.63268 12.5791 8.40165 12.58 8.16671V7.83337C12.5791 7.59843 12.6402 7.36741 12.7573 7.1637C12.8744 6.96 13.0432 6.79085 13.2467 6.67337L13.3467 6.61337C13.6523 6.43634 13.8752 6.14526 13.9665 5.80404C14.0577 5.46282 14.0098 5.09933 13.8333 4.79337L13.6867 4.54004C13.5096 4.2344 13.2186 4.01149 12.8773 3.92025C12.5361 3.829 12.1726 3.87688 11.8667 4.05337L11.7667 4.10671C11.564 4.22373 11.3341 4.28534 11.1 4.28534C10.866 4.28534 10.636 4.22373 10.4333 4.10671L10.1467 3.94004C9.94418 3.82313 9.77599 3.65503 9.65898 3.4526C9.54196 3.25017 9.48024 3.02052 9.48 2.78671V2.66671C9.48 2.31309 9.33953 1.97395 9.08948 1.7239C8.83943 1.47385 8.50029 1.33337 8.14667 1.33337Z"
              stroke={resolvedTheme === "dark" ? "#FAFAFA" : "#09090B"}
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8 10C9.10457 10 10 9.10461 10 8.00004C10 6.89547 9.10457 6.00004 8 6.00004C6.89543 6.00004 6 6.89547 6 8.00004C6 9.10461 6.89543 10 8 10Z"
              stroke={resolvedTheme === "dark" ? "#FAFAFA" : "#09090B"}
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Settings
        </DropdownMenuItem>
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ThemeSwitchButton />
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.9997 14.6667V12C10.0924 11.1649 9.85299 10.3268 9.33303 9.66671C11.333 9.66671 13.333 8.33337 13.333 6.00004C13.3864 5.16671 13.153 4.34671 12.6664 3.66671C12.853 2.90004 12.853 2.10004 12.6664 1.33337C12.6664 1.33337 11.9997 1.33337 10.6664 2.33337C8.90637 2.00004 7.09303 2.00004 5.33303 2.33337C3.9997 1.33337 3.33303 1.33337 3.33303 1.33337C3.13303 2.10004 3.13303 2.90004 3.33303 3.66671C2.84761 4.34396 2.61201 5.16857 2.66637 6.00004C2.66637 8.33337 4.66637 9.66671 6.66637 9.66671C6.40637 9.99337 6.21303 10.3667 6.0997 10.7667C5.98637 11.1667 5.95303 11.5867 5.9997 12M5.9997 12V14.6667M5.9997 12C2.99303 13.3334 2.66634 10.6667 1.33301 10.6667"
              stroke={resolvedTheme === "dark" ? "#FAFAFA" : "#09090B"}
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Github
        </DropdownMenuItem>
        <DropdownMenuItem>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_89_1297)">
              <path
                d="M3.2863 3.28666L6.11296 6.11333M9.88639 6.11333L12.7131 3.28666M9.88639 9.88676L12.7131 12.7134M6.11296 9.88676L3.2863 12.7134M14.6663 8.00004C14.6663 11.6819 11.6816 14.6667 7.99967 14.6667C4.31778 14.6667 1.33301 11.6819 1.33301 8.00004C1.33301 4.31814 4.31778 1.33337 7.99967 1.33337C11.6816 1.33337 14.6663 4.31814 14.6663 8.00004ZM10.6663 8.00004C10.6663 9.4728 9.47243 10.6667 7.99967 10.6667C6.52692 10.6667 5.33301 9.4728 5.33301 8.00004C5.33301 6.52728 6.52692 5.33337 7.99967 5.33337C9.47243 5.33337 10.6663 6.52728 10.6663 8.00004Z"
                stroke={resolvedTheme === "dark" ? "#FAFAFA" : "#09090B"}
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_89_1297">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
          Support
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="!text-red-500">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6M10.6667 11.3333L14 8M14 8L10.6667 4.66667M14 8H6"
              stroke="rgba(239, 68, 68)"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <p className="mt-[-2px]">Log out</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
