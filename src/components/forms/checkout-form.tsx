"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Calendar } from "../ui/calendar";
import CountInput from "../ui/count-input";
import { addDays } from "date-fns";
import { VenueType } from "@/lib/validation/types";
import { DateRange } from "react-day-picker";
import { Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils/utils";
import { CheckoutFormType, checkoutFormSchema } from "@/lib/validation/schemas";

type CheckoutFormProps = {
  venue: VenueType;
  isLoading: boolean;
  onSubmit: (values: CheckoutFormType) => Promise<void>;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
};

export default function CheckoutForm({
  venue,
  isLoading,
  onSubmit,
  date,
  setDate,
}: CheckoutFormProps) {
  const form = useForm<CheckoutFormType>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      guests: 1,
      date: {
        from: date?.from || new Date(),
        to: date?.to || addDays(new Date(), 7),
      },
    },
  });

  // Extract booked dates
  const bookedDates = venue.bookings!.flatMap((booking) => {
    const startDate = new Date(booking.dateFrom);
    const endDate = new Date(booking.dateTo);
    const dates = [];
    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  });

  // Function to check if a date is booked
  const isDateBooked = (date: any) => {
    return bookedDates.some(
      (bookedDate) => bookedDate.toDateString() === date.toDateString()
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full justify-between"
      >
        <div>
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="w-64 flex flex-col mx-auto items-center">
                <FormLabel className="text-start w-full text-base px-2">
                  Date
                </FormLabel>
                <FormControl>
                  <Calendar
                    className="rounded-3xl bg-background shadow-xl"
                    initialFocus
                    mode="range"
                    defaultMonth={field.value?.from}
                    selected={field.value}
                    onSelect={field.onChange}
                    numberOfMonths={1}
                    disabled={isDateBooked}
                  />
                </FormControl>
                <FormDescription className="px-2">
                  Select the start and end date for your stay
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
        <div className="flex justify-evenly w-full md:w-fit md:flex-col ml-auto gap-2 md:pr-4 text-sm text-muted-foreground py-6">
          <p className="">Tax • 10%</p>
          <p className="">Amount • {form.watch("guests")}</p>
          <p className="md:border-t text-foreground">
            Total • {formatPrice(venue.price * form.watch("guests") * 1.1)}
          </p>
        </div>
        <Button type="submit" className="text-primary-foreground">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Order"
          )}
        </Button>
      </form>
    </Form>
  );
}
