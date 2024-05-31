"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";

export default function ViewBookingsButtonGroup({
  isVenueManager,
}: {
  isVenueManager: boolean;
}) {
  const [activeButton, setActiveButton] = useState<"incoming" | "outgoing">(
    "outgoing"
  );
  const pathname = usePathname();
  const router = useRouter();

  function handleIncomingClick() {
    setActiveButton("incoming");
    router.replace(`${pathname}?search=incoming`);
  }

  function handleOutgoingClick() {
    setActiveButton("outgoing");
    router.replace(`${pathname}`);
  }

  return (
    <div className="flex gap-1 w-52">
      <Button
        size={"sm"}
        variant={activeButton === "outgoing" ? "default" : "ghost"}
        className="w-1/2"
        onClick={handleOutgoingClick}
        id="outgoing"
      >
        Outgoing
      </Button>

      <Button
        size={"sm"}
        disabled={!isVenueManager}
        variant={activeButton === "incoming" ? "default" : "ghost"}
        className="w-1/2"
        onClick={handleIncomingClick}
        id="incoming"
      >
        Incoming
      </Button>
    </div>
  );
}
