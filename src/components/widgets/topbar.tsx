import Link from "next/link";
import React from "react";
import ProfileAvatarMenu from "./profile-avatar-menu";
import { fetchProfileByName } from "@/lib/server/api/api.action";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils/utils";
import { cookies } from "next/headers";
import NavLinks from "./nav-links";

type Props = {};

export default async function Topbar({}: Props) {
  const username = cookies().get("username");
  let res = null;
  if (username) {
    res = await fetchProfileByName(username.value);
  }

  return (
    <nav className="flex w-full justify-between px-2 py-1 items-center max-w-screen-2xl mx-auto">
      <Link href={"/"}>
        {/* <Image src={""} alt={""} /> */}
        Logo
      </Link>
      <div className="flex gap-2 items-center">
        {username && <NavLinks isTopbar />}
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
      </div>
    </nav>
  );
}
