// file: schemas.ts
import { z } from "zod";

// Zod is validate forms and types for runtime validation.

// // Infer the Types directly from Zod schema
// export type VenueType = z.infer<typeof VenueSchema>;
// export type MediaType = z.infer<typeof MediaSchema>;
// // Booking types
// export type BookingType = z.infer<typeof BookingSchema>;
// export type CreateBookingType = z.infer<typeof CreateBookingSchema>;
// // export type BookingFormType = z.infer<typeof BookingFormSchema>;
// // Auth types
// export type ProfileType = z.infer<typeof BaseProfileSchema>;
// export type RegistrationType = z.infer<typeof RegistrationSchema>;
// export type LoginType = z.infer<typeof LoginSchema>;
// // Meta data type
// export type MetaType = z.infer<typeof MetaSchema>;

// Media schema
export const MediaSchema = z.object({
  url: z.string().url({ message: "Invalid URL for media." }).max(500),
  alt: z.string(),
});

export const MetaSchema = z.object({
  isFirstPage: z.boolean().optional().default(false),
  isLastPage: z.boolean().optional().default(false),
  currentPage: z.number().optional().default(1),
  previousPage: z.number().nullable().optional(),
  nextPage: z.number().nullable().optional(),
  pageCount: z.number().optional().default(1),
  totalCount: z.number().optional().default(0),
});

// Define MetaSchema here since it's used in VenueSchema
const VenueMetaSchema = z.object({
  wifi: z.boolean(),
  parking: z.boolean(),
  breakfast: z.boolean(),
  pets: z.boolean(),
});

const LocationSchema = z.object({
  address: z.string().nullable(),
  city: z.string().nullable(),
  zip: z.string().nullable(),
  country: z.string().nullable(),
  continent: z.string().nullable(),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
});

// Owner schema defined without nullable initially
export const OwnerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  bio: z.string().nullable(),
  avatar: MediaSchema,
  banner: MediaSchema,
});

// CreateVenue schema
export const CreateVenueSchema = z.object({
  name: z.string(),
  description: z.string(),
  media: z.array(MediaSchema).optional(),
  price: z.coerce.number(),
  maxGuests: z.coerce.number().min(1),
  rating: z.number().optional().default(0),
  meta: VenueMetaSchema.optional(),
  location: LocationSchema.optional(),
});

// Customer schema references OwnerSchema
const CustomerSchema = OwnerSchema.omit({ banner: true }).nullable();

// Define the Booking schema without making it nullable here
const BaseBookingSchema = z.object({
  id: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  guests: z.number().optional(),
  created: z.string().optional(),
  updated: z.string().optional(),
  customer: CustomerSchema.optional(),
});

// Make the Booking object nullable where needed
export const BookingSchema = BaseBookingSchema.nullable();

// Define CreateBookingSchema using .pick from the base schema and .extend
export const CreateBookingSchema = BaseBookingSchema.pick({
  dateFrom: true,
  dateTo: true,
  guests: true,
}).extend({
  venueId: z.string().optional(),
});

// Adjust the Main Venue Schema
export const VenueSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  media: z.array(MediaSchema),
  price: z.number(),
  maxGuests: z.number(),
  rating: z.number(),
  created: z.string(),
  updated: z.string(),
  meta: VenueMetaSchema,
  location: LocationSchema,
  owner: OwnerSchema.optional(), // Allows owner to be undefined
  bookings: z.array(BookingSchema).optional(), // Allows bookings to be undefined
});

// Define the Extended Customer schema as before
// const ExtendedCustomerSchema = OwnerSchema.omit({ banner: true })
//   .extend({
//     banner: MediaSchema.optional(),
//   })
//   .nullable();

// Define the Booking schema
// export const BookingSchema = z.object({
//   id: z.string(),
//   dateFrom: z.string(),
//   dateTo: z.string(),
//   guests: z.number(),
//   created: z.string(),
//   updated: z.string(),
//   customer: ExtendedCustomerSchema.optional(),
//   venue: VenueSchema.optional(),
// });

// Define the array of VenueType using the Zod schema
export const VenueArraySchema = z.array(VenueSchema);

// Helper function to validate email domain
const emailDomainCheck = (email: string) => {
  return email.endsWith("@stud.noroff.no") || email.endsWith("@noroff.no");
};

// Define the base user profile schema with refined error messages
export const BaseProfileSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long." })
    .max(20, { message: "Name must not exceed 20 characters." }),
  email: z
    .string()
    .email({ message: "Invalid email address format." })
    .refine(emailDomainCheck, {
      message: "Email must end with '@stud.noroff.no' or '@noroff.no'.",
    }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(50, { message: "Password must not exceed 50 characters." }),
  bio: z
    .string()
    .min(6, { message: "Bio must be at least 6 characters long." })
    .max(250, { message: "Bio must not exceed 250 characters." })
    .optional(),
  avatar: z.object({
    url: z.string().url({ message: "Invalid URL for avatar." }),
    alt: z.string(),
  }),
  banner: z.object({
    url: z.string().url({ message: "Invalid URL for banner." }),
    alt: z.string(),
  }),
  venueManager: z.boolean(),
});

export const UpdateProfileSchema = z.object({
  bio: z
    .string()
    .min(6, { message: "Bio must be at least 6 characters long." })
    .max(250, { message: "Bio must not exceed 250 characters." })
    .optional(),
  avatar: MediaSchema.optional(),
  banner: MediaSchema.optional(),
  venueManager: z.boolean().optional(),
});
// Define the registration schema with specific required fields and confirmPassword
export const RegistrationSchema = BaseProfileSchema.pick({
  name: true,
  email: true,
  password: true,
  venueManager: true,
})
  .extend({
    confirmPassword: z
      .string()
      .min(8, {
        message: "Confirm password must be at least 8 characters long.",
      })
      .max(50, { message: "Confirm password must not exceed 50 characters." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const LoginSchema = BaseProfileSchema.pick({
  email: true,
  password: true,
});

// Define the Zod schema for an API key
const ApiKeySchema = z.object({
  name: z.string().max(32).default("API Key"),
  status: z.literal("ACTIVE"),
  key: z.string(),
});

// TypeScript type for the API Key
export type ApiKeyType = z.infer<typeof ApiKeySchema>;
