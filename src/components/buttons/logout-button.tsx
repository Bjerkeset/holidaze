"use client";

import { logOut } from "@/lib/server/utils/utils.action";
import { Button } from "../ui/button";

export default function LogoutButton() {
  return (
    <Button className="w-full" onClick={() => logOut()}>
      Log out
    </Button>
  );
}
