import { cn } from "@/lib/utils/utils";
import { VenueType } from "@/lib/validation/schemas";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  venue: VenueType;
};

export default function VenueCard({ venue }: Props) {
  // Default media URL as placeholder
  let mediaUrl = "https://placehold.co/600x400";

  // Check if there's at least one media item and use its URL
  if (venue.media.length > 0) {
    mediaUrl = venue.media[0].url;
  }

  return (
    <Link href={`venue/${venue.id}`} className="overflow-hidden">
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
  );
}
