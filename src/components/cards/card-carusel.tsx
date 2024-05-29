"use client";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import { MediaType } from "@/lib/validation/types";
import { useState } from "react";

type Props = {
  media: MediaType[];
};

export function CardCarousel({ media }: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // //   if (media.length <= 1) {
  // //     return (
  // //       <div className="w-full bg-green-400">
  // //         <div className="flex aspect-square items-center justify-center w-full max-h-[50v] bg-green-400">
  // //           <Image
  // //             src={media[0].url}
  // //             fill
  // //             alt={media[0].alt || "Image"}
  // //             className="w-full h-full object-cover"
  // //           />
  // //         </div>
  // //       </div>
  // //     );
  // //   }

  console.log("media", media);

  return (
    <div className="w-full h-full md:pt-4 ">
      <Carousel
        setApi={setApi}
        className="max-w-full md:max-w-[650px] mx-auto "
      >
        <CarouselContent className=" ">
          {media.map((media, index) => (
            <CarouselItem key={index}>
              <div className="p-1 ">
                <Card className="  p-0 m-0 overflow-hidden border-none">
                  <CardContent className="flex aspect-square items-center justify-center m-0 p-0 w-full h-auto">
                    {/* <Image
                      src={media.url}
                      fill
                      alt={media.alt || "Image"}
                      className="w-full h-full object-cover"
                    /> */}
                    <img
                      src={media.url}
                      alt={media.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute z-50 w-4/5 bg-green-400 bottom-5">
                      dsadas{media.alt}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
      <div className="text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>
    </div>
  );
}
