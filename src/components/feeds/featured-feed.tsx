import React from "react";
import VenueCard from "../cards/venue-card-sm";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils/utils";
import { VenueType } from "@/lib/validation/types";
import BookingList from "../widgets/booking-list";
import VenuesGrid from "./venues-grid";

type Props = {
  venues: VenueType[];
  isSmall?: boolean;
};

export default function FeaturedFeed({ venues, isSmall }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold">Featured</h2>
      <div className="flex">
        <Carousel className="flex max-w-[320px] sm:max-w-[400px] md:max-w-screen-md xl:max-w-screen-xl mx-auto ">
          <CarouselContent className="flex w-full py-2 -ml-1 ">
            {venues.map((venue: VenueType) => (
              <CarouselItem
                key={venue.id}
                className={cn("w-full h-full md:basis-1/2 xl:basis-1/3 ")}
              >
                <VenueCard key={venue.id} md venue={venue} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </div>
  );
}

//
