import { BookingType, ExpandedBookingType } from "@/lib/validation/types";
import { cn, formatDate, formatTimeFrame } from "@/lib/utils/utils";
import ProfileAvatar from "./profile-avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { Badge } from "../ui/badge";

type Props = {
  bookings: BookingType[] | ExpandedBookingType[];
  collapsible?: boolean;
  username: string;
};

export default function BookingList({
  bookings,
  collapsible,
  username,
}: Props) {
  const { length } = bookings;

  if (collapsible) {
    return (
      <div className="px-6">
        <Accordion type="multiple">
          <AccordionItem className="border-none" value="item-1">
            <AccordionTrigger className="flex items-center">
              <span className="flex items-center justify-center border rounded-full w-5 h-5 border-red-500 text-xs bg-red-500/10 backdrop-blur-3xl">
                {length}
              </span>
              <span className="text-sm">BOOKINGS</span>
            </AccordionTrigger>
            <AccordionContent className="bg-accent/50 backdrop-blur-lg w-full rounded-2xl">
              <ScrollArea className="h-96">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-2 text-sm space-y-2 my-2 rounded-none"
                  >
                    <div className="flex items-center">
                      {booking.customer && (
                        <ProfileAvatar profile={booking.customer} />
                      )}
                      <p className="text-nowrap">
                        {booking.guests} Guest{booking.guests > 1 && "s"}
                      </p>
                    </div>
                    <div className="text-xs flex items-center justify-between">
                      <p>{formatDate(booking.dateFrom)}</p>
                      <p className=" ">
                        {formatTimeFrame(booking.dateFrom, booking.dateTo)}{" "}
                        booked
                      </p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  } else {
    return (
      <>
        {bookings.map((booking) => (
          <Link
            key={booking.id}
            className={cn(
              "flex shadow p-2 text-sm my-2 rounded-none hover:bg-secondary transition-colors duration-200"
            )}
            href={`/venue/${"venueId" in booking ? booking.venueId : ""}`}
          >
            <div className="flex flex-col items-center w-1/6">
              {booking.customer && (
                <ProfileAvatar
                  isOwner={username === booking.customer.name}
                  willFit
                  profile={booking.customer}
                  className={cn("")}
                />
              )}
              <p className="text-xs text-nowrap hidden md:block">
                Created {formatTimeFrame(booking.created, new Date()) + " ago"}
              </p>
            </div>
            <div className="text-xs flex flex-col items-center w-full justify-between">
              {"venueTitle" in booking && (
                <p className="text-sm md:text-base font-semibold">
                  {booking.venueTitle}
                </p>
              )}
              <p className="flex gap-1">
                <span className="hidden sm:block">From - </span>
                {formatDate(booking.dateFrom)}
              </p>
            </div>
            <div className="text-xs flex flex-col items-center w-full lg:w-1/4 justify-between">
              <div className="flex justify-start w-full items-center gap-1 h-full">
                {"venuePrice" in booking && (
                  <Badge className="text-nowrap bg-green-500/80 rounded-full">
                    + ${booking.venuePrice * booking.guests}
                  </Badge>
                )}
                <div className="flex flex-col items-end justify-around w-full h-full">
                  <p className="text-nowrap text-xs md:text-sm pr-0 md:pr-4">
                    {booking.guests} Guest{booking.guests > 1 && "s"}
                  </p>
                  <p className="pr-0 md:pr-1 hidden md:block">
                    {formatTimeFrame(booking.dateFrom, booking.dateTo)} booked
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </>
    );
  }
}
