import { VenueType } from "@/lib/validation/schemas";
import Image from "next/image";
import { Clock, Star } from "lucide-react";
import { MdOutlineFreeBreakfast } from "react-icons/md";
import { CiWifiOn } from "react-icons/ci";
import { FaDog } from "react-icons/fa";
import { IoCarOutline } from "react-icons/io5";
import { CardCarousel } from "./card-carusel";

type Props = {
  venue: VenueType;
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

export default function VenueCardXl({ venue }: Props) {
  let mediaUrl = "https://placehold.co/600x400";
  let alt = venue.name;
  if (venue.media.length > 0) {
    mediaUrl = venue.media[0].url;
    alt = venue.media[0].alt || venue.name;
  }

  return (
    <div className="flex flex-col items-center">
      {/* <Image
          src={mediaUrl}
          height={100}
          width={100}
          alt={alt}
          className="w-full h-full sticky top-0 max-h-[50vh] rounded-3xl p-2"
        /> */}
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
          <h2 className="font-semibold">Details</h2>
          <ul className="list-disc flex gap-5 px-4 text-sm">
            <li className="list-none">guests {venue.maxGuests}</li>
            <li>bedrooms x</li>
            <li>beds x</li>
            <li>bath x</li>
          </ul>
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
          <div className="">
            <p className="text-card-foreground/85 text-pretty">
              {venue.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
