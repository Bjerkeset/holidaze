import Link from "next/link";
import React from "react";
import Image from "next/image";
import ProfileAvatar from "./profile-avatar";

type Props = {};

export default function Topbar({}: Props) {
  return (
    <nav>
      <ul className="flex w-full justify-between">
        <li>
          <Link href={"/"}>
            {/* <Image src={""} alt={""} /> */}
            Logo
          </Link>
        </li>
        <li>
          <Link href={"/"}>
            <ProfileAvatar />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
