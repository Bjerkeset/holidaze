"use client";
import React from "react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils/utils";

type Props = {
  className?: string;
};

export default function ResetButton({ className }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Button
      className={cn("", className)}
      size={"sm"}
      onClick={() => router.replace(pathname, { scroll: false })}
    >
      Reset
    </Button>
  );
}
