"use client";
import { useState, useEffect } from "react";
import { ExpandedBookingType } from "@/lib/validation/types";
import { Calendar } from "../ui/calendar";
import { isWithinInterval, addDays } from "date-fns";

type Props = {
  bookings: ExpandedBookingType[];
};

export default function BookingCalendar({ bookings }: Props) {
  // Extract booked dates
  const bookedDates = bookings.flatMap((booking) => {
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
    <div className="w-full flex justify-center">
      <Calendar
        isBookingIndicator={true}
        mode="single"
        disabled={isDateBooked}
      />
    </div>
  );
}
