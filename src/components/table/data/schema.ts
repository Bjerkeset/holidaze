// schema.ts
import { z } from "zod";

export const venueSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  maxGuests: z.number(),
  bookings: z.array(z.object({})), // Adjust the inner object schema if needed
});

export type Venue = z.infer<typeof venueSchema>;
