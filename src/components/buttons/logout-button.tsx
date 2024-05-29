"use client";

import { logOut } from "@/lib/server/utils/utils.action";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleClick() {
    await logOut();
    router.refresh();
  }
  return (
    <Button className="w-full" onClick={handleClick}>
      Log out
    </Button>
  );
}
