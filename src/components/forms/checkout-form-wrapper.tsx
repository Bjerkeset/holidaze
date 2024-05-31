"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { formatDate, formatPrice } from "@/lib/utils/utils";
import { createBooking } from "@/lib/server/api/api.action";
import { toast } from "sonner";
import { VenueType } from "@/lib/validation/types";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import CheckoutForm from "./checkout-form";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { CheckoutFormType } from "@/lib/validation/schemas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

type Props = {
  venue: VenueType;
  isLoggedIn: boolean;
};

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setValue(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
}

export default function CheckoutFormWrapper({ venue, isLoggedIn }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const router = useRouter();
  const isLargeScreen = useMediaQuery("(min-width: 678px)");

  const handleSubmit = async (values: CheckoutFormType) => {
    console.log(values);
    setIsLoading(true);
    try {
      const res = await createBooking({
        venueId: venue.id,
        dateFrom: values.date.from.toISOString(),
        dateTo: values.date.to.toISOString(),
        guests: values.guests,
      });

      if (res.error) {
        console.error("An error occurred:", res.error);
        res.error.errors.forEach((err) => toast.error(err.message));
        setIsLoading(false);
        return;
      }
      console.log("res", res);
      toast.success("Booking submitted successfully");
    } catch (error: any) {
      console.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLargeScreen) {
    return (
      <Dialog>
        <DialogTrigger className="flex w-full items-center rounded-b-lg border-t p-2 justify-between bg-background max-w-screen-2xl">
          <p>{formatPrice(venue.price)} / night</p>
          {isLoggedIn ? (
            <Button className="m-2" onClick={() => setIsOpen(true)}>
              Book Now
            </Button>
          ) : (
            <Button className="m-2" asChild>
              <Link href={"/profile/auth"}>Sign in to Book</Link>
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <div className="w-full flex flex-col items-center  pt-3">
              <h2 className="text-xl">{venue.name}</h2>
            </div>
            <DialogDescription className="mx-auto">
              <div className="flex gap-4">
                <p>
                  {date?.from
                    ? formatDate(date.from, "LLL dd")
                    : "Select a date"}
                </p>
                <p>-</p>
                <p>
                  {date?.to
                    ? formatDate(date.to, "LLL dd yyyy")
                    : "Select a date"}
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <CheckoutForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            venue={venue}
            date={date}
            setDate={setDate}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="">
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ y: "70vh", opacity: 0 }} // Start from the middle of the screen
              animate={{ y: 0, opacity: 1 }} // Move to the top
              exit={{ y: "-100vh", opacity: 0 }} // Exit towards the bottom
              transition={{ ease: "easeInOut", duration: 0.6 }} // Customize timing and easing
              className="h-[50vh] z-50 fixed inset-x-0 top-0"
            >
              <div className="w-full flex flex-col items-center text-white pt-3">
                <h2 className="text-xl">{venue.name}</h2>
                <div className="flex gap-4">
                  <p>
                    {date?.from
                      ? formatDate(date.from, "LLL dd")
                      : "Select a date"}
                  </p>
                  <p>-</p>
                  <p>
                    {date?.to
                      ? formatDate(date.to, "LLL dd yyyy")
                      : "Select a date"}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="md:hidden flex fixed bottom-0 w-full items-center border-t p-2 justify-between bg-background max-w-screen-lg">
          <p>{formatPrice(venue.price)} / night</p>
          {isLoggedIn ? (
            <DrawerTrigger asChild>
              <Button size={"lg"}>Book Now</Button>
            </DrawerTrigger>
          ) : (
            <Button className="m-2">
              <Link href={"/profile/auth"}>Sign in to Book</Link>
            </Button>
          )}
        </div>
        <DrawerContent className="h-[90vh]">
          <DrawerFooter className="h-full">
            <CheckoutForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              venue={venue}
              date={date}
              setDate={setDate}
            />
            <DrawerClose>
              <Button className="w-full" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
