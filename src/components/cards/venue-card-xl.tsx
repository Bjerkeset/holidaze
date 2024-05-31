import Image from "next/image";
import { Clock, Divide, Settings, Star } from "lucide-react";
import { MdOutlineFreeBreakfast } from "react-icons/md";
import { CiWifiOn } from "react-icons/ci";
import { FaDog } from "react-icons/fa";
import { IoCarOutline } from "react-icons/io5";
import { CardCarousel } from "./card-carusel";
import {
  BookingType,
  ExpandedBookingType,
  VenueType,
} from "@/lib/validation/types";
import ProfileAvatar from "../widgets/profile-avatar";
import { cn } from "@/lib/utils/utils";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import Map from "../map/map";
import CheckoutFormWrapper from "../forms/checkout-form-wrapper";
import BookingList from "../widgets/booking-list";
import DeleteButton from "../buttons/delete-button";

type Props = {
  venue: VenueType;
  isOwner?: boolean;
  isLoggedIn: boolean;
};

const featuresConfig = [
  {
    title: "Breakfast",
    icon: <MdOutlineFreeBreakfast />,
    metaKey: "breakfast", // This corresponds to the key in the venue.meta object
  },
  {
    title: "Wi-Fi",
    icon: <CiWifiOn />,
    metaKey: "wifi",
  },
  {
    title: "Parking",
    icon: <IoCarOutline />,
    metaKey: "parking",
  },
  {
    title: "Pets",
    icon: <FaDog />,
    metaKey: "pets",
  },
  {
    title: "Guests",
    icon: <FaDog />,
    metaKey: "guests",
  },
];

export default function VenueCardXl({ venue, isOwner, isLoggedIn }: Props) {
  let mediaUrl = "https://placehold.co/600x400";
  let alt = venue.name;
  if (venue.media.length > 0) {
    mediaUrl = venue.media[0].url;
    alt = venue.media[0].alt || venue.name;
  }
  const maxGuests = Math.max(1, Math.ceil(venue.maxGuests));
  const beds = Math.max(1, Math.ceil(venue.maxGuests - 2));
  const bedrooms = Math.max(1, Math.ceil(venue.maxGuests / 2));

  const processBookings = (venue: VenueType): ExpandedBookingType[] =>
    (venue.bookings || []).map((booking) => ({
      ...booking,
      venueTitle: venue.name,
      venueId: venue.id,
      venuePrice: venue.price,
    }));
  const bookings = processBookings(venue);
  return (
    <div className="flex flex-col items-center justify-between h-full">
      <div className=" flex flex-col w-full md:w-4/5">
        <CardCarousel media={venue.media} />
        <div className="p-4 space-y-10 pb-24">
          <div className="">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{venue.name}</h2>
              <p className="flex gap-1 items-center">
                <Star className="text-yellow-500 h-5 w-5" />
                <span> {venue.rating} </span>
              </p>
            </div>
            <p>
              <span>{venue.location.address} </span>
              {/* <span>{venue.location.city}, </span> */}
              {/* <span>{venue.location.country}</span> */}
            </p>
          </div>
          <div className="h-auto flex flex-col gap-6">
            <div className="grid grid-cols-2 grid-rows-2 sm:flex gap-3 w-fit self-center  sm:justify-center sm:items-center">
              {featuresConfig.map(({ title, icon, metaKey }) => {
                if (venue.meta[metaKey as keyof typeof venue.meta]) {
                  return (
                    <div
                      key={metaKey}
                      className="rounded-3xl p-px bg-gradient-to-b from-accent to-transparent"
                    >
                      <div
                        className="rounded-2xl shadow-xl p-2 w-20 h-20 border flex flex-col items-center gap-1"
                        key={title}
                      >
                        <span className="text-2xl">{icon}</span>
                        <span>{title}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>

            <div className="flex flex-col gap-6 md:flex-row justify-between py-2">
              <div>
                <h2 className="font-semibold text-lg">Facility</h2>
                <ul className="list-disc px-6 flex flex-col md:flex-row gap-1 w-fit">
                  <li className="flex justify-between items-center gap-3 border-b md:border-b-0 md:px-3 border-primary">
                    <span className="mt-auto">Max Guests </span>
                    <span className="text-bold text-xl">{maxGuests}</span>
                  </li>
                  <li className="flex justify-between items-center gap-3 border-b md:border-l md:border-b-0 md:px-3 border-primary">
                    <span className="mt-auto">Beds</span>
                    <span className="text-bold text-xl">{beds}</span>
                  </li>
                  <li className="flex justify-between items-center gap-3 border-b md:border-l md:border-b-0 md:px-3 border-primary">
                    <span className="mt-auto">Bedrooms</span>
                    <span className="text-bold text-xl">{bedrooms}</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-lg">Venue Manager</p>
                {venue.owner && <ProfileAvatar profile={venue.owner} />}
              </div>
            </div>

            <div className="">
              <h2 className="font-semibold  text-lg">Details</h2>
              <p className="text-card-foreground/85 text-pretty">
                {venue.description}
              </p>
            </div>
            {venue.location.address && (
              <div className="h-[400px] w-full mx-auto rounded-lg overflow-hidden">
                <Map address={venue.location.address} />
              </div>
            )}
            <div>
              {isOwner && (
                <div className="">
                  <h2 className="text-semibold">Bookings</h2>
                  <p className="text-muted-foreground">
                    You have {bookings.length} active booking
                    {bookings.length !== 1 && `s`}
                  </p>
                  <BookingList
                    isVenuePage
                    isOwner={isOwner}
                    bookings={bookings}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        {!isOwner && (
          <CheckoutFormWrapper venue={venue} isLoggedIn={isLoggedIn} />
        )}
        {isOwner && (
          <div className="hidden md:flex w-full items-center border-t p-2  gap-2 bg-background">
            <DeleteButton id={venue.id} />
            <Link
              className={cn(
                buttonVariants({ variant: "default" }),
                "flex gap-2"
              )}
              href={`/venue/${venue.id}/update`}
            >
              <Settings className="h-5 w-5" />
              <span>Edit</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
