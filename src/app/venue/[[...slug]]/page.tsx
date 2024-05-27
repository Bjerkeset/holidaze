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
import { CreateBookingSchema } from "@/lib/validation/schemas";
import { Settings } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function VenuePage({
  params,
}: {
  params: { slug: string };
}) {
  // let data = null;
  let isOwner = false;
  const username = cookies().get("username");
  const { data: venue, error: error } = await fetchVenueById(params.slug[0]);

  if (username) {
    const { data: profile, error: profileError } = await fetchProfileByName(
      "bjerkeset"
    );
    if (profileError) {
      return <ErrorToast error={profileError} />;
    }
    console.log("profile", profile);
    if (username.value === venue?.owner?.name) {
      isOwner = true;
    }
  }

  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");

  if (error) {
    return <ErrorToast error={error} />;
  }

  if (!venue || venue === null) {
    return <p>Could not find venue</p>;
  }

  if (isOwner && params.slug[1] === "update") {
    return (
      <div className="flex items-center h-full px-3">
        <CreateVenueForm venue={venue} isEditing />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full justify-between">
      <VenueCardXl isOwner={isOwner} venue={venue} />
      {!isOwner && <CheckoutForm venue={venue} />}
      {isOwner && (
        <div className="flex fixed bottom-0 w-full items-center border-t p-2 justify-between bg-background">
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
