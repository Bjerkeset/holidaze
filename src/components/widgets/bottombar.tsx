"use client";

import {
  CandlestickChart,
  FilePlus2,
  Heart,
  HomeIcon,
  LayoutDashboard,
  Scroll,
  Search,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Bottombar() {
  const pathname = usePathname();

  return (
    <section className="fixed bottom-0 z-10 w-full bg-background/50 p-2 backdrop-blur-sm px-7 md:hidden">
      <div className="flex items-center justify-between gap-3 px-7">
        {NAVIGATION_LINKS.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;
          const IconComponent = link.Component;
          return (
            <Link
              href={link.route}
              key={link.label}
              className={`relative flex flex-col items-center gap-2 rounded-lg p-2 sm:flex-1 sm:px-2 sm:py-2.5; ${
                isActive && `bg-secondary border border-rounded`
              }`}
            >
              <IconComponent className="text-primary w-6 h-6" />
              <p className="text-subtle-medium text-light-1 max-sm:hidden">
                {/* Only display the first word */}
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
const NAVIGATION_LINKS = [
  {
    Component: Search,
    route: "/",
    label: "Home",
  },
  {
    Component: Heart,
    route: "/dashboard",
    label: "Dashboard",
  },
  //   {
  //     Component: Scroll,
  //     route: "/market",
  //     label: "Market",
  //   },
  {
    Component: FilePlus2,
    route: "/venue/create",
    label: "Create",
  },
  {
    Component: User,
    route: "/profile",
    label: "Profile",
  },
];
