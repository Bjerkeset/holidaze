import { cn } from "@/lib/utils/utils";
import { VenueType, ExpandedBookingType } from "@/lib/validation/types";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BookingList from "../widgets/booking-list";
import ProfileAvatar from "../widgets/profile-avatar";

type Props = {
  venue: VenueType;
  className?: string;
  currentUser?: string;
  md?: boolean;
  xs?: boolean;
};

export default function VenueCard({
  venue,
  className,
  currentUser,
  md,
  xs,
}: Props) {
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

  // Assuming bookings are of type BookingType[], map them to ExpandedBookingType[]
  const expandedBookings: ExpandedBookingType[] =
    venue.bookings?.map((booking) => ({
      ...booking,
      venueTitle: venue.name,
      venuePrice: venue.price,
      venueId: venue.id,
    })) || [];

  return (
    <div className="rounded-2xl shadow w-full bg-card p-2 border">
      <Link
        href={`/venue/${venue.id}`}
        className={cn("overflow-hidden", className)}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-xl h-56",
            md && "h-96",
            xs && "h-40"
          )}
        >
          <Image
            src={mediaUrl}
            alt={venue.name || "Venue image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-full object-cover group-hover:scale-125 group-hover:rotate-3 duration-500"
          />
          <div className="relative p-2 w-fit">
            <div className="flex rounded-md bg-secondary/50 relative z-20 px-2">
              <ProfileAvatar className="z-50" noClick profile={venue.owner!} />
              <div className="absolute -inset-1 rounded-md blur-md bg-gradient-to-br from-gray-300 via-white/50 to-gray-300 z-10"></div>
            </div>
          </div>
        </div>
        <div className="flex justify-between px-4 py-2">
          <div className="flex flex-col">
            <h2 className="overflow-hidden max-h-6">{venue.name}</h2>
            <p className="text-xs text-muted-foreground">
              ${venue.price} / night
            </p>
          </div>
          <div className="flex gap-1 items-center">
            <Star className="text-yellow-500 h-5 w-5" />
            <p className="font-semibold">{venue.rating}</p>
          </div>
        </div>
      </Link>
      {isOwner ? (
        <div>
          {expandedBookings.length > 0 ? (
            <BookingList
              collapsible
              username={currentUser || ""}
              bookings={expandedBookings}
            />
          ) : (
            <div className="text-muted-foreground text-sm flex h-12 items-center justify-center mt-1">
              <p>NO BOOKINGS</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
