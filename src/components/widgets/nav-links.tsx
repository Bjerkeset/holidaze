"use client";

import { NAVIGATION_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  isTopbar?: boolean;
};

export default function NavLinks({ isTopbar }: Props) {
  const pathname = usePathname();
  return (
    <div className="flex items-center justify-between gap-3 px-7">
      {NAVIGATION_LINKS.map((link) => {
        const isActive =
          (pathname.includes(link.route) && link.route.length > 1) ||
          pathname === link.route;
        const IconComponent = link.Component;
        // const isCreate = link.label === "Create";
        return (
          <Link
            href={link.route}
            key={link.label}
            className={cn(
              "relative flex flex-col items-center gap-2 rounded-lg p-2 sm:flex-1 sm:px-2 sm:py-2.5 hover:transition hover:shadow hover:bg-secondary/60 duration-300",
              isActive && "bg-secondary border border-rounded",
              isTopbar && "flex-row hidden md:flex"
            )}
          >
            <IconComponent className={cn("text-primary w-6 h-6")} />
            <p
              className={cn(
                " max-sm:hidden text-sm",
                isTopbar && "max-xl:hidden",
                isActive && "max-xl:block"
              )}
            >
              {/* Only display the first word */}
              {link.label.split(/\s+/)[0]}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
