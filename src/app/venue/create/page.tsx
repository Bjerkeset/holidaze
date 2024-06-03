import CreateVenueForm from "@/components/forms/create-venue-form";
import { buttonVariants } from "@/components/ui/button";
import { fetchProfileByName } from "@/lib/server/api/api.action";
import { cn } from "@/lib/utils/utils";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function CreateVenuePage() {
  const username = cookies().get("username");
  let res = null;
  if (username?.value) {
    res = await fetchProfileByName(username.value);
    if (!res.data?.venueManager) {
      return (
        <div className="flex flex-col items-center pt-[10vh] px-4 gap-2 ">
          <h2>Become a venue manager to create a venue</h2>
          <Link
            className={cn(buttonVariants({ variant: "default" }))}
            href={"/profile"}
          >
            Upgrade
          </Link>
        </div>
      );
    } else
      return (
        <div className="flex flex-col items-center pt-[10vh] px-4 w-full">
          <CreateVenueForm />
        </div>
      );
  }

  return (
    <div className="flex flex-col items-center pt-[10vh] px-4 gap-2">
      <h2>Log in to create venues</h2>
      <Link
        className={cn(buttonVariants({ variant: "default" }))}
        href={"/profile/auth"}
      >
        Log in
      </Link>
    </div>
  );
}
