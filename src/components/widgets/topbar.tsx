import Link from "next/link";
import React from "react";
import Image from "next/image";
import ProfileAvatarMenu from "./profile-avatar-menu";
import { fetchProfileByName } from "@/lib/server/api/api.action";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils/utils";
import { cookies } from "next/headers";
import { AlignRight } from "lucide-react";

type Props = {};

export default async function Topbar({}: Props) {
  const username = cookies().get("username");
  let res = null;
  if (username) {
    res = await fetchProfileByName(username.value);
  }

  return (
    <nav>
      <ul className="flex w-full justify-between px-2 py-1 items-center">
        <li>
          <Link href={"/"}>
            {/* <Image src={""} alt={""} /> */}
            Logo
          </Link>
        </li>
        <li>
          {res && res.data ? (
            <ProfileAvatarMenu profile={res.data} />
          ) : (
            <Link
              className={cn(buttonVariants({ variant: "default" }))}
              href={"/profile/auth"}
            >
              Log in / Register
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
