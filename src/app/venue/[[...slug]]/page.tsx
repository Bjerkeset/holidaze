import VenueCardXl from "@/components/cards/venue-card-xl";
import CheckoutForm from "@/components/forms/checkout-form";
import CreateVenueForm from "@/components/forms/create-venue-form";
import { buttonVariants } from "@/components/ui/button";
import ErrorToast from "@/components/widgets/error";
import {
  fetchProfileByName,
  fetchVenueById,
} from "@/lib/server/api/api.action";
import { cn } from "@/lib/utils/utils";
import { Settings } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function VenuePage({
  params,
}: {
  params: { slug: string };
}) {
  const id = params.slug && params.slug[0] ? params.slug[0] : undefined;

  if (!id) {
    return (
      <div className="pt-[30vh] text-lg">
        Venue id not found <span className="text-3xl">🤒</span>
      </div>
    );
  }
  // let data = null;
  let isOwner = false;
  let isLoggedIn = false;
  const username = cookies().get("username");
  const { data: venue, error: error } = await fetchVenueById(id);

  if (!venue) {
    return (
      <div className=" pt-[30vh] text-lg">
        No Venue with id {id} found <span className="text-3xl mx-2">🤒</span>
      </div>
    );
  }

  if (username) {
    isLoggedIn = true;
    const { data: profile, error: profileError } = await fetchProfileByName(
      username.value
    );
    if (profileError) {
      return <ErrorToast error={profileError} />;
    }
    console.log("profile", profile);
    if (username.value === venue?.owner?.name) {
      isOwner = true;
    }
  }
  if (error) {
    return <ErrorToast error={error} />;
  }
  if (!venue || venue === null) {
    return <p>Could not find venue</p>;
  }
  if (isOwner && params.slug[1] === "update") {
    return (
      <div className="flex items-center h-full w-full px-3">
        <CreateVenueForm venue={venue} isEditing />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full justify-between md:border md:shadow md:my-10 md:rounded-xl  max-w-screen-lg ">
      <VenueCardXl isOwner={isOwner} isLoggedIn={isLoggedIn} venue={venue} />
      {/* {!isOwner && <CheckoutForm venue={venue} />} */}
      {isOwner && (
        <div className="flex fixed bottom-0 w-full items-center border-t p-2 justify-between bg-background md:hidden ">
          <Link
            className={cn(buttonVariants({ variant: "default" }), "flex gap-3")}
            href={`/venue/${venue.id}/update`}
          >
            <Settings className="h-5 w-5" />
            <span>Edit</span>
          </Link>
        </div>
      )}
    </div>
  );
}
