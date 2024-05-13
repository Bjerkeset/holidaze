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
import { cn } from "@/lib/utils/utils";

type Props = {
  venues: VenueType[];
  isSmall?: boolean;
  title: string;
};

export default function CustomFeed({ venues, isSmall, title }: Props) {
  return (
    <div>
      <h2 className="text-2xl">{title}</h2>
      <Carousel className="w-full max-w-[400px] ">
        <CarouselContent>
          {venues.map((venue: VenueType) => (
            <CarouselItem key={venue.id} className={cn(isSmall && "basis-1/2")}>
              <VenueCard key={venue.id} venue={venue} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious />
        <CarouselNext /> */}
      </Carousel>
    </div>
  );
}
