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
  title: string;
};

export default function CustomFeed({ venues, isSmall, title }: Props) {
  return (
    <div>
      <h2 className="text-2xl">{title}</h2>
      <div className="flex">
        <Carousel className="w-full max-w-[400px] mx-auto">
          <CarouselContent>
            {venues.map((venue: VenueType) => (
              <CarouselItem
                key={venue.id}
                className={cn(isSmall && "basis-1/2")}
              >
                <VenueCard key={venue.id} venue={venue} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </div>
  );
}
