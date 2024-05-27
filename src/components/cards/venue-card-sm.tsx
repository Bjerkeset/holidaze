import { cn } from "@/lib/utils/utils";
import { VenueType } from "@/lib/validation/types";

import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BookingList from "../widgets/booking-list";
import { cookies } from "next/headers";
import { Button } from "../ui/button";

type Props = {
  venue: VenueType;
  className?: string;
  currentUser?: string;
};

export default function VenueCard({ venue, className, currentUser }: Props) {
  let isOwner = false;

  if (currentUser === venue.owner?.name) {
    isOwner = true;
  }
  // Default media URL as placeholder
  let mediaUrl = "https://placehold.co/600x400";

  // Check if there's at least one media item and use its URL
  if (venue.media.length > 0) {
    mediaUrl = venue.media[0].url;
  }

  return (
    <div className="rounded-2xl shadow col-span-2">
      <Link
        href={`/venue/${venue.id}`}
        className={cn("overflow-hidden", className)}
      >
        <div className={cn("relative overflow-hidden rounded-xl h-56")}>
          <Image
            src={mediaUrl}
            alt={venue.name || "Venue image"}
            height={100}
            width={100}
            className="w-full h-full object-cover group-hover:scale-125 group-hover:rotate-3 duration-500"
          />
        </div>
        <div className="flex justify-between px-4">
          <div>
            <h2 className="text-nowrap overflow-hidden">{venue.name}</h2>
            <p className="text-xs text-muted-foreground">
              $ {venue.price} / night
            </p>
          </div>
          <div className="flex gap-1 items-center">
            <Star className="text-yellow-500 h-5 w-5" />
            <p className="font-semibold">{venue.rating}</p>
            <p className="text-xs text-muted-foreground"></p>
          </div>
        </div>
      </Link>
      {isOwner ? (
        <div>
          {venue.bookings && venue.bookings.length > 0 ? (
            <BookingList bookings={venue.bookings} />
          ) : (
            <div className="text-muted-foreground text-sm flex h-12 items-center justify-center mt-1">
              <p className="">NO BOOKINGS</p>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full p-2 flex">
          <Button className={"mx-auto w-full rounded-xl"} size={"sm"}>
            View
          </Button>
        </div>
      )}
    </div>
  );
}
