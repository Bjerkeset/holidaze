import { z } from "zod";
import { CreateVenueSchema } from "./schemas";
import { ReactNode } from "react";

// Define the ErrorDetail type for individual errors
export type ErrorDetail = {
  message: string;
  code: string;
  path: Array<string | number>;
};

// Define the ErrorResponse type for the whole error object
export type ErrorObj = {
  errors: ErrorDetail[];
  status: string;
  statusCode: 400 | 401 | 403 | 404 | 500;
};

export type APIResponse<T, M = {}> = {
  data?: T;
  meta?: M;
  error?: ErrorObj;
};

// Define the type for the parameters object
export type FetchBookingsParams = {
  includeCustomer: boolean;
  includeVenue: boolean;
  accessToken: string;
};
export type CreateVenueType = z.infer<typeof CreateVenueSchema>;

// File: types.ts

export type MediaType = {
  url: string;
  alt: string;
};

export type MetaType = {
  isFirstPage?: boolean;
  isLastPage?: boolean;
  currentPage?: number;
  previousPage?: number | null;
  nextPage?: number | null;
  pageCount?: number;
  totalCount?: number;
};

export type VenueMetaType = {
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
};

export type LocationType = {
  address: string | null;
  city: string | null;
  zip: string | null;
  country: string | null;
  continent: string | null;
  lat: number | null;
  lng: number | null;
};

export type OwnerType = {
  name: string;
  email: string;
  bio: string | null;
  avatar: MediaType;
  banner: MediaType;
};

export type CustomerType = {
  name: string;
  email: string;
  bio: string | null;
  avatar: MediaType;
};

export type BookingType = {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  customer: CustomerType | null;
  venue: VenueType | null;
};

export type ExpandedBookingType = BookingType & {
  venueTitle: string;
  venuePrice: number;
  venueId: string;
};

export type CreateBookingType = {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId?: string;
};

export type VenueType = {
  id: string;
  name: string;
  description: string;
  media: MediaType[];
  price: number;
  maxGuests: number;
  rating: number;
  created: string;
  updated: string;
  meta: VenueMetaType;
  location: LocationType;
  owner?: OwnerType;
  bookings?: BookingType[];
};

export type ProfileType = {
  name: string;
  email: string;
  bio: string;
  avatar: MediaType;
  banner: MediaType;
  venueManager: boolean;
  _count: {
    venues: number;
    bookings: number;
  };
};

export type RegistrationType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  venueManager: boolean;
};

export type LoginType = {
  email: string;
  password: string;
};

export type ApiKeyType = {
  name: string;
  status: "ACTIVE";
  key: string;
};

export type UpdateUserRequestType = {
  bio?: string;
  avatar?: MediaType;
  banner?: MediaType;
  venueManager?: boolean;
};
export type CreateVenueResponseType = {
  data: VenueType;
  meta: Record<string, unknown>;
};

export type priceDataType = {
  time: string;
  value: number;
};

export type StatisticsCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  percentageChange?: number;
};

export type SearchParamsType = {
  search: string | "";
  sort: string | "";
  page: number | 1;
};
