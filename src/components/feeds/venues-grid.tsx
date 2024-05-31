import { VenueType } from "@/lib/validation/types";
import VenueCard from "../cards/venue-card-sm";
import BookingList from "../widgets/booking-list";
import { cookies } from "next/headers";
import { Divide } from "lucide-react";

type Props = {
  venues: VenueType[];
};

export default function VenuesGrid({ venues }: Props) {
  const username = cookies().get("username");
  return (
    <div className="grid grid-cols-1 grid-flow-dense px-4 max-w-md md:grid-cols-2 md:max-w-screen-md lg:max-w-screen-lg lg:grid-cols-3 xl:grid-cols-4 xl:max-w-screen-2xl gap-4 mx-auto">
      {venues.length <= 0 && <div>No Venues here</div>}
      {venues.map((venue: VenueType) => (
        <div key={venue.id}>
          <VenueCard venue={venue} currentUser={username?.value} />
        </div>
      ))}
    </div>
  );
}
