import { VenueType } from "@/lib/validation/schemas";
import React from "react";
import VenueCard from "../cards/venue-card-sm";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Props = {
  venues: VenueType[];
};

export default function FeaturedFeed({ venues }: Props) {
  return (
    <Carousel className="w-full max-w-[400px] bg-red-100">
      <CarouselContent>
        {venues.map((venue: VenueType) => (
          <CarouselItem key={venue.id} className="">
            <VenueCard key={venue.id} venue={venue} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
