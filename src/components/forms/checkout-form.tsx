"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { cn, formatDate, formatPrice } from "@/lib/utils/utils";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  BookingType,
  CreateBookingSchema,
  CreateBookingType,
  VenueType,
} from "@/lib/validation/schemas";
import { Calendar } from "../ui/calendar";
import { DateRange } from "react-day-picker";
import CountInput from "../ui/count-input";
import { useRouter } from "next/navigation";

type Props = {
  venue: VenueType;
};

const formSchema = z.object({
  date: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .refine(
      (data) => data.from > addDays(new Date(), -1),
      "Start date must be in the future"
    ),
  guests: z.coerce.number().min(1),
});
type FormType = z.infer<typeof formSchema>;
export default function CheckoutForm({ venue }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guests: 1,
    },
  });

  const {
    formState: { errors },
  } = form;
  console.log("errors", errors);

  function onSubmit(values: FormType) {
    console.log(values);
    router.push(`/bookings/${venue.id}`);
  }

  console.log("form", form.watch("date"));
  isOpen;
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
                    {form.watch("date.from")
                      ? formatDate(form.watch("date.from"), "LLL dd")
                      : "Select a date"}
                  </p>
                  <p>-</p>
                  <p>
                    {form.watch("date.to")
                      ? formatDate(form.watch("date.to"), "LLL dd yyyy")
                      : "Select a date"}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Button variant="secondary" onClick={() => setIsOpen(true)}>
          Another Button
        </Button>
        <div className="flex fixed bottom-0 w-full items-center border-t p-2 justify-between bg-background">
          <p>{formatPrice(venue.price)} / night</p>
          <DrawerTrigger asChild>
            <Button size={"lg"}>Book Now</Button>
          </DrawerTrigger>
        </div>
        <DrawerContent className="h-[90vh]">
          {/* <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader> */}
          <DrawerFooter className="h-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col  h-full justify-between"
              >
                <div className="">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="w-64  flex flex-col mx-auto items-center">
                        <FormLabel className="text-start w-full text-base px-2">
                          Date
                        </FormLabel>
                        <FormControl>
                          <Calendar
                            className=" rounded-3xl bg-background shadow-xl"
                            initialFocus
                            mode="range"
                            defaultMonth={field.value?.from}
                            selected={field.value}
                            onSelect={field.onChange}
                            numberOfMonths={1}
                          />
                        </FormControl>
                        <FormDescription className="px-2">
                          Select the start and end date for you stay
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* <FormField
                  control={form.control}
                  name="dateTo"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of birth</FormLabel>

                      <FormControl>
                        <Calendar
                          className="w-full bg-red-200"
                          onSelect={(range: DateRange) => {
                            setDate(range); // Update local state for UI purposes
                            if (range.to) {
                              field.onChange(range.to); // Update the form state with the end date
                            }
                          }}
                          selected={date}
                          mode="range"
                          defaultMonth={date?.from}
                          numberOfMonths={1}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </FormControl>

                      <FormDescription>
                        Your date of birth is used to calculate your age.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
                  name="guests"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Guests</FormLabel>
                        <FormDescription>
                          How many guests will be staying?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <CountInput {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-evenly w-full  md:w-fit md:flex-col ml-auto gap-2 md:pr-4 text-sm text-muted-foreground">
                  <p className="">Tax • 10%</p>
                  {/* <p className="">Fee • 5%</p> */}
                  <p className="">Amount • {form.watch("guests")}</p>
                  <p className="md:border-t text-foreground">
                    Total •{" "}
                    {formatPrice(venue.price * form.watch("guests") * 1.1)}
                  </p>
                </div>

                <Button type="submit">Order</Button>
              </form>
            </Form>
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