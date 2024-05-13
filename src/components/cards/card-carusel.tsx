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
import { MediaType } from "@/lib/validation/schemas";
import Image from "next/image";
import { Divide, Key } from "lucide-react";

type Props = {
  media: MediaType[];
};

export function CardCarousel({ media }: Props) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

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

  return (
    <div className="w-full bg-slate-100  ">
      <Carousel
        setApi={setApi}
        opts={{
          align: "end",
        }}
        className="w-full mx-auto  max-w-[670px] rounded-xl border border-red-500 overflow-hidden"
      >
        <CarouselContent>
          {media.map((media, index) => (
            <CarouselItem key={`${media.url}`} className={""}>
              <Card key={index}>
                <CardContent className=" aspect-square overflow-hidden justify-center p-0 m-0 rounded-lg bg-green-400 ">
                  <Image
                    src={media.url}
                    fill
                    alt={media.alt || "Image"}
                    className=" object-cover max-w-screen-sm rounded-lg min-w-full min-h-full"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious />
        <CarouselNext /> */}
      </Carousel>
      <div className="text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>
    </div>
  );
}
