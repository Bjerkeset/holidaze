import Image from "next/image";
import { Clock, Settings, Star } from "lucide-react";
import { MdOutlineFreeBreakfast } from "react-icons/md";
import { CiWifiOn } from "react-icons/ci";
import { FaDog } from "react-icons/fa";
import { IoCarOutline } from "react-icons/io5";
import { CardCarousel } from "./card-carusel";
import { VenueType } from "@/lib/validation/types";
import ProfileAvatar from "../widgets/profile-avatar";
import { cn } from "@/lib/utils/utils";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import CheckoutForm from "../forms/checkout-form";

type Props = {
  venue: VenueType;
  isOwner?: boolean;
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
];

export default function VenueCardXl({ venue, isOwner }: Props) {
  let mediaUrl = "https://placehold.co/600x400";
  let alt = venue.name;
  if (venue.media.length > 0) {
    mediaUrl = venue.media[0].url;
    alt = venue.media[0].alt || venue.name;
  }

  return (
    <div className="flex flex-col items-center justify-between bg-blue-400">
      <div className="bg-red-200 flex flex-col">
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
              <span>{venue.location.address}, </span>
              <span>{venue.location.city}, </span>
              <span>{venue.location.country}</span>
            </p>
          </div>
          <div className="space-y-2">
            {/* <ul className="list-disc flex gap-5 px-4 text-sm">
            <li className="list-none">guests {venue.maxGuests}</li>
            <li>bedrooms x</li>
            <li>beds x</li>
            <li>bath x</li>
          </ul> */}

            <div className="flex gap-3 justify-center">
              {featuresConfig.map(({ title, icon, metaKey }) => {
                if (venue.meta[metaKey as keyof typeof venue.meta]) {
                  return (
                    <div
                      key={metaKey}
                      className="rounded-3xl p-px bg-gradient-to-b from-accent to-transparent"
                    >
                      <div
                        className=" rounded-2xl shadow-xl p-2 w-20 h-20 border border- flex flex-col items-center gap-1"
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
            <div className=" space-y-2">
              <p className="font-semibold">Venue Mananger</p>
              {venue.owner && <ProfileAvatar profile={venue.owner} />}
            </div>
            <div className="">
              <h2 className="font-semibold">Details</h2>
              <p className="text-card-foreground/85 text-pretty">
                {venue.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-green-400 w-full">
        {!isOwner && <CheckoutForm venue={venue} />}
        {isOwner && (
          <div className="hidden md:flex w-full items-center border-t p-2 justify-between bg-background bg-yellow-400  ">
            <Link
              className={cn(
                buttonVariants({ variant: "default" }),
                "flex gap-3"
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
