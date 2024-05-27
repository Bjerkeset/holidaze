import { BookingType } from "@/lib/validation/types";
import { formatDate, formatTimeFrame } from "@/lib/utils/utils";
import ProfileAvatar from "./profile-avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "../ui/scroll-area";

type Props = {
  bookings: BookingType[];
};

export default function BookingList({ bookings }: Props) {
  const { length } = bookings;
  return (
    <div className="px-6">
      <Accordion type="multiple">
        <AccordionItem className="border-none " value="item-1">
          <AccordionTrigger className="flex items-center ">
            <span className="flex items-center justify-center border rounded-full w-5 h-5 border-red-500 text-xs bg-red-500/10 backdrop-blur-3xl   ">
              {length}
            </span>
            <span className=" text-sm">BOOKINGS</span>
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
                      {formatTimeFrame(booking.dateFrom, booking.dateTo)} booked
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
}
