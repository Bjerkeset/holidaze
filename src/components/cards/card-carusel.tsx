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
import { cn } from "@/lib/utils/utils";

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

  //   if (media.length <= 1) {
  //     return (
  //       <div className="w-full bg-green-400">
  //         <div className="flex aspect-square items-center justify-center w-full max-h-[50v] bg-green-400">
  //           <Image
  //             src={media[0].url}
  //             fill
  //             alt={media[0].alt || "Image"}
  //             className="w-full h-full object-cover"
  //           />
  //         </div>
  //       </div>
  //     );
  //   }

  console.log("media", media);

  return (
    <div className="w-full h-full ">
      <Carousel setApi={setApi} className=" w-full p-1">
        <CarouselContent className="max-w-[660px] mx-auto flex  ">
          {media.map((media, index) => (
            <CarouselItem
              key={index}
              className={cn(index === 0 && "-ml-2 md:-ml-4")}
            >
              <Card className=" mr-auto overflow-hidden ">
                <CardContent className="flex aspect-square items-center justify-center m-0 p-0  w-full h-auto">
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
                  <div className="absolute mx-auto p-1 z-50 bottom-0 w-2/3 ">
                    <div className="flex rounded-md bg-secondary/50 relative z-20 px-2 text-black">
                      <p> {media.alt} </p>
                      <div className="absolute -inset-1 rounded-md blur-md bg-gradient-to-br from-gray-300/50 via-white/50 to-gray-300/50 z-10"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className=" hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
      <div className="text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>
    </div>
  );
}
