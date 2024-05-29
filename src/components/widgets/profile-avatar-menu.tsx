import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils/utils";
import { buttonVariants } from "../ui/button";
import { ProfileType } from "@/lib/validation/types";
import LogoutButton from "../buttons/logout-button";
import ProfileAvatar from "./profile-avatar";
import { AlignRight } from "lucide-react";

type Props = {
  profile: ProfileType;
};

export default function ProfileAvatarMenu({ profile }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex gap-2 items-center hover:bg-secondary/60 transition duration-300 hover:shadow rounded-lg px-2">
        <ProfileAvatar profile={profile} noClick />
        <AlignRight />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={"/dashboard"}>Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={"/profile"}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
