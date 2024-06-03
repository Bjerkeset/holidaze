"use client";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/lib/utils/hooks";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

type Props = {
  bookings: ExpandedBookingType[];
  collapsible?: boolean;
  isOwner?: boolean;
  username?: string;
  isVenuePage?: boolean;
};

export default function BookingList({
  bookings,
  collapsible,
  username,
  isOwner,
  isVenuePage,
}: Props) {
  const { length } = bookings;
  const [selectedBooking, setSelectedBooking] =
    useState<ExpandedBookingType | null>(null);
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const renderBadge = (booking: ExpandedBookingType) => {
    const isCustomer = username === booking.customer?.name;
    const badgeText = `${isCustomer ? "-" : "+"} $${
      booking.venuePrice * booking.guests
    }`;
    const badgeColor = isCustomer ? "bg-red-500/80" : "bg-green-500/80";

    return (
      <Badge className={`text-nowrap rounded-full ${badgeColor}`}>
        {badgeText}
      </Badge>
    );
  };

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
                    className="p-2 text-sm space-y-2 my-2 rounded-none "
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
  }
  // Rendered on maximized venue card (venue page).
  if (isVenuePage) {
    if (!isOwner) {
      return null;
    }
    if (isDesktop) {
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          {bookings.map((booking) => (
            <DialogTrigger
              key={booking.id}
              className="w-full"
              onClick={() => setSelectedBooking(booking)}
            >
              <div className="flex shadow p-2 text-sm my-2 rounded-none hover:bg-secondary transition-colors duration-200">
                <div className="flex flex-col items-center w-1/6">
                  {booking.customer && (
                    <ProfileAvatar
                      isOwner={username === booking.customer.name || isOwner}
                      willFit
                      profile={booking.customer}
                    />
                  )}
                  <p className="text-xs text-nowrap hidden md:block">
                    Created{" "}
                    {formatTimeFrame(booking.created, new Date()) + " ago"}
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
                  <p className="flex gap-1">
                    <span className="hidden sm:block">To - </span>
                    {formatDate(booking.dateTo)}
                  </p>
                </div>
                <div className="text-xs flex flex-col items-center w-full lg:w-1/4 justify-between">
                  <div className="flex justify-start w-full items-center gap-1 h-full">
                    {renderBadge(booking)}
                    <div className="flex flex-col items-end justify-around w-full h-full">
                      <p className="text-nowrap text-xs md:text-sm pr-0 md:pr-4">
                        {booking.guests} Guest{booking.guests > 1 && "s"}
                      </p>
                      <p className="pr-0 md:pr-1 hidden md:block">
                        {formatTimeFrame(booking.dateFrom, booking.dateTo)}{" "}
                        booked
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogTrigger>
          ))}
          {selectedBooking && (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Booking Receipt</DialogTitle>
                <DialogDescription>
                  Complete information about the booking
                </DialogDescription>
              </DialogHeader>
              <ExpandedBookingWindow selectedBooking={selectedBooking} />
            </DialogContent>
          )}
        </Dialog>
      );
    }
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        {bookings.map((booking) => (
          <DialogTrigger
            key={booking.id}
            className="w-full"
            onClick={() => setSelectedBooking(booking)}
          >
            <div className="flex shadow p-2 text-sm my-2 rounded-none hover:bg-secondary transition-colors duration-200">
              <div className="flex flex-col items-center w-1/6">
                {booking.customer && (
                  <ProfileAvatar
                    isOwner={username === booking.customer.name || isOwner}
                    willFit
                    profile={booking.customer}
                  />
                )}
                <p className="text-xs text-nowrap hidden md:block">
                  Created{" "}
                  {formatTimeFrame(booking.created, new Date()) + " ago"}
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
                <p className="flex gap-1">
                  <span className="hidden sm:block">To - </span>
                  {formatDate(booking.dateTo)}
                </p>
              </div>
              <div className="text-xs flex flex-col items-center w-full lg:w-1/4 justify-between">
                <div className="flex justify-start w-full items-center gap-1 h-full">
                  {renderBadge(booking)}
                  <div className="flex flex-col items-end justify-around w-full h-full">
                    <p className="text-nowrap text-xs md:text-sm pr-0 md:pr-4">
                      {booking.guests} Guest{booking.guests > 1 && "s"}
                    </p>
                    <p className="pr-0 md:pr-1 hidden md:block">
                      {formatTimeFrame(booking.dateFrom, booking.dateTo)}
                      booked
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DialogTrigger>
        ))}
        {selectedBooking && (
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Booking Receipt</DrawerTitle>
              <DrawerDescription>
                Complete information about the booking
              </DrawerDescription>
            </DrawerHeader>
            <ExpandedBookingWindow selectedBooking={selectedBooking} />

            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        )}
      </Drawer>
    );
  }

  // rendered on dashboard
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
                isOwner={username === booking.customer.name || isOwner}
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
              {renderBadge(booking)}
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

function ExpandedBookingWindow({
  selectedBooking,
}: {
  selectedBooking: ExpandedBookingType;
}) {
  return (
    <div className="flex flex-col gap-4 px-6">
      <div className="flex flex-col mb-4 gap-4">
        <h2 className="text-lg font-semibold">{selectedBooking.venueTitle}</h2>
        <div className="space-y-1">
          <p>
            Purchase Id:{" "}
            <span className="text-muted-foreground text-sm">
              {selectedBooking.id}
            </span>{" "}
          </p>
          <div className=" flex gap-1 items-center">
            <p>Created:</p>
            <p className="text-muted-foreground text-sm">
              {formatTimeFrame(selectedBooking.created, new Date())} ago
            </p>
          </div>
          <div className=" ">
            <span>Customer:</span>
            <ProfileAvatar profile={selectedBooking.customer!} />
          </div>
        </div>
      </div>
      <div className="flex flex-col mb-4 ">
        <h3 className="text-base font-medium">Booking Period</h3>
        <p className="text-muted-foreground text-sm">
          From: {formatDate(selectedBooking.dateFrom)}
        </p>
        <p className="text-muted-foreground text-sm">
          To: {formatDate(selectedBooking.dateTo)}
        </p>
        <div className="pt-4">
          <h2 className="text-base font-medium">Duration:</h2>
          <p className="text-muted-foreground text-sm">
            {formatTimeFrame(selectedBooking.dateFrom, selectedBooking.dateTo)}{" "}
            booked
          </p>
        </div>
      </div>
      <div className="flex flex-col pb-4 border-b">
        <h3 className="text-base font-medium">Guests</h3>
        <p className="text-muted-foreground">
          {selectedBooking.guests} Guest
          {selectedBooking.guests > 1 && "s"}
        </p>
      </div>
      <div className="flex flex-col mb-4">
        <h3 className="text-md font-semibold">Payment</h3>
        <p>
          Total Price: ${selectedBooking.venuePrice * selectedBooking.guests}
        </p>
      </div>
    </div>
  );
}
