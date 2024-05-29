import NavLinks from "./nav-links";
import { cookies } from "next/headers";

export default function Bottombar() {
  const username = cookies().get("username");

  if (username)
    return (
      <section className="fixed bottom-0 z-10 w-full bg-background/50 p-2 backdrop-blur-sm px-7 md:hidden">
        <NavLinks />
      </section>
    );
  else return null;
}
