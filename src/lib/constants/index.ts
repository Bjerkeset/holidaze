import { FilePlus2, Heart, LayoutTemplate, Search, User } from "lucide-react";

export const NAVIGATION_LINKS = [
  {
    Component: Search,
    route: "/",
    label: "Home",
  },
  {
    Component: LayoutTemplate,
    route: "/dashboard",
    label: "Dashboard",
  },
  //   {
  //     Component: Scroll,
  //     route: "/market",
  //     label: "Market",
  //   },
  {
    Component: User,
    route: "/profile",
    label: "Profile",
  },
  {
    Component: FilePlus2,
    route: "/venue/create",
    label: "Create",
  },
];
