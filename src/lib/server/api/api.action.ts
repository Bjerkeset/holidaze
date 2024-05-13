"use server";
// File: api.action.ts
import {
  APIResponse,
  ErrorObj,
  FetchBookingsParams,
} from "@/lib/validation/types";
import {
  BookingType,
  MetaType,
  VenueArraySchema,
  VenueSchema,
  MetaSchema,
  VenueType,
  BookingSchema,
  RegistrationType,
  ProfileType,
  LoginType,
  ApiKeyType,
} from "@/lib/validation/schemas";
import { cookies } from "next/headers";

const BASE = "https://v2.api.noroff.dev";

export async function createBooking({
  dateFrom,
  dateTo,
  guests,
  venueId,
  accessToken,
}: {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
  accessToken: string;
}): Promise<APIResponse<BookingType>> {
  try {
    // First, retrieve the API key using the accessToken
    const apiKeyResponse = await createApiKey(accessToken, "Create Booking");
    if (apiKeyResponse.error || !apiKeyResponse.data) {
      console.error(
        "Failed to retrieve API Key:",
        apiKeyResponse.error || "No API key received"
      );
      return {
        meta: {},
        error: apiKeyResponse.error || {
          errors: [
            {
              message: "Failed to retrieve API Key",
              code: "api_key_failure",
              path: [],
            },
          ],
          status: "Error",
          statusCode: 500,
        },
      };
    }
    console.log("API Key response:", apiKeyResponse);
    const apiKey = apiKeyResponse.data.key; // Assuming this is how the key is accessed

    // Now make the booking request with the API key included
    const response = await fetch(`${BASE}/holidaze/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      },
      body: JSON.stringify({
        dateFrom,
        dateTo,
        guests,
        venueId,
      }),
    });

    if (!response.ok) {
      const errorResponse: ErrorObj = await response.json();
      console.error(
        "HTTP error while creating booking! Status:",
        response.status,
        errorResponse
      );
      return {
        meta: {},
        error: errorResponse,
      };
    }

    const jsonResponse = await response.json();
    if (jsonResponse && jsonResponse.data) {
      const data = BookingSchema.parse(jsonResponse.data);
      return {
        data,
        meta: {},
      };
    } else {
      throw new Error(
        "Received data is not in expected format: expected a booking object"
      );
    }
  } catch (error: any) {
    console.error("Failed to create booking:", error.message);
    return {
      meta: {},
      error: {
        errors: [
          {
            message: error.message || "An error occurred",
            code: "internal_error",
            path: [],
          },
        ],
        status: "Internal Server Error",
        statusCode: 500,
      },
    };
  }
}

export async function fetchBookings({
  includeCustomer,
  includeVenue,
  accessToken,
}: FetchBookingsParams): Promise<APIResponse<Array<BookingType>, MetaType>> {
  const apiKeyResponse = await createApiKey(
    accessToken,
    "Optional API Key Name"
  );

  // Ensure that apiKeyResponse contains data before attempting to use it
  if (apiKeyResponse.error || !apiKeyResponse.data) {
    console.error(
      "Failed to retrieve API Key:",
      apiKeyResponse.error || "No data received"
    );
    return {
      meta: MetaSchema.parse({}),
      error: apiKeyResponse.error || {
        errors: [
          {
            message: "No API key data received",
            code: "api_key_missing",
            path: [],
          },
        ],
        status: "Error",
        statusCode: 500,
      },
    };
  }

  const apiKey = apiKeyResponse.data.key; // Now safe to access `key` as we've confirmed `data` is not undefined

  const queryParameters = new URLSearchParams({
    _customer: includeCustomer ? "true" : "false",
    _venue: includeVenue ? "true" : "false",
  });

  try {
    const response = await fetch(
      `${BASE}/holidaze/bookings?${queryParameters}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey, // Use the retrieved API key
        },
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      errorResponse.errors.forEach((err: any) =>
        console.error("--- At fetchBookings() -->", err.message)
      );
      return {
        meta: MetaSchema.parse({}),
        error: errorResponse,
      };
    }

    const jsonResponse = await response.json();
    const data = jsonResponse.data.map((item: any) =>
      BookingSchema.parse(item)
    );
    const meta = MetaSchema.parse(jsonResponse.meta);

    return {
      data,
      meta,
      error: undefined,
    };
  } catch (error: any) {
    console.error("Failed to fetch bookings:", error.message);
    return {
      meta: MetaSchema.parse({}), // Provide default or empty meta
      error: {
        errors: [
          {
            message: error.message || "An error occurred",
            code: "internal_error",
            path: [],
          },
        ],
        status: "Internal Server Error",
        statusCode: 500,
      },
    };
  }
}

// Function to fetch a single venue by its ID
export async function fetchVenueById(
  id: string
): Promise<APIResponse<VenueType>> {
  try {
    const response = await fetch(`${BASE}/holidaze/venues/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorResponse: ErrorObj = await response.json();
      console.error("HTTP error! Status:", response.status, errorResponse);
      return {
        meta: {},
        error: errorResponse,
      };
    }

    const jsonResponse = await response.json();

    // Verify that jsonResponse.data is the correct type using the Zod schema
    if (jsonResponse && jsonResponse.data) {
      const data = VenueSchema.parse(jsonResponse.data);
      return {
        data,
        meta: {},
      };
    } else {
      throw new Error(
        "Received data is not in expected format: expected a single venue object"
      );
    }
  } catch (error: any) {
    console.error("Failed to fetch venue:", error.message);
    return {
      meta: {},
      error: {
        errors: [
          {
            message: error.message || "An error occurred",
            code: "internal_error",
            path: [],
          },
        ],
        status: "Internal Server Error",
        statusCode: 500,
      },
    };
  }
}

// Function to fetch all venues
export async function fetchAllVenues(): Promise<
  APIResponse<VenueType[], MetaType>
> {
  try {
    const response = await fetch(`${BASE}/holidaze/venues`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorResponse: ErrorObj = await response.json();
      console.error("HTTP error! Status:", response.status, errorResponse);
      return {
        meta: MetaSchema.parse({}), // Use MetaSchema to provide a default/empty meta object
        error: errorResponse,
      };
    }

    const jsonResponse = await response.json();

    if (jsonResponse && Array.isArray(jsonResponse.data)) {
      const data = VenueArraySchema.parse(jsonResponse.data);
      // Ensure to parse and include the meta data correctly
      return {
        data,
        meta: MetaSchema.parse(jsonResponse.meta),
      };
    } else {
      throw new Error("Received data is not in expected format: array");
    }
  } catch (error: any) {
    console.error("Failed to fetch venues:", error.message);
    return {
      meta: MetaSchema.parse({}), // Provide a default meta in case of an error
      error: {
        errors: [
          {
            message: error.message || "An error occurred",
            code: "internal_error",
            path: [],
          },
        ],
        status: "Internal Server Error",
        statusCode: 500,
      },
    };
  }
}

// Function to register a new user
export async function registerUser(
  userProfile: RegistrationType
): Promise<APIResponse<ProfileType>> {
  try {
    const response = await fetch(`${BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userProfile),
    });

    if (!response.ok) {
      const errorResponse: ErrorObj = await response.json();
      console.error("HTTP error! Status:", response.status, errorResponse);
      return {
        meta: {},
        data: undefined,
        error: errorResponse,
      };
    }

    const data: ProfileType = await response.json();
    console.log("User registered successfully:", data);
    return {
      data,
      meta: {},
    };
  } catch (error: any) {
    console.error("Failed to register user:", error.message);
    return {
      meta: {},
      error: {
        errors: [{ message: error.message, code: "internal_error", path: [] }],
        status: "Internal Server Error",
        statusCode: 500,
      },
    };
  }
}

export async function loginUser(
  loginDetails: LoginType
): Promise<APIResponse<ProfileType>> {
  let responseData: any; // Define responseData to hold the response data

  try {
    const response = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginDetails),
    });

    if (!response.ok) {
      const errorResponse: ErrorObj = await response.json();
      console.error("HTTP error! Status:", response.status, errorResponse);
      return {
        meta: {},
        data: undefined,
        error: errorResponse,
      };
    }

    responseData = await response.json(); // Assign response data to responseData
    const { data } = responseData; // Destructure data from responseData
    console.log("User logged in successfully:", data);
    console.log("accessToken:", data.accessToken);
    cookies().set("accessToken", data.accessToken);

    return {
      data,
      meta: {},
    };
  } catch (error: any) {
    console.error("Failed to log in user:", error.message);
    return {
      meta: {},
      error: {
        errors: [{ message: error.message, code: "internal_error", path: [] }],
        status: "Internal Server Error",
        statusCode: 500,
      },
    };
  }
}

export async function createApiKey(
  accessToken: string,
  name?: string
): Promise<APIResponse<ApiKeyType>> {
  const requestBody = name ? JSON.stringify({ name }) : null;
  try {
    const response = await fetch(`${BASE}/auth/create-api-key`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: requestBody,
    });

    if (!response.ok) {
      const errorResponse: ErrorObj = await response.json();
      return {
        data: undefined,
        meta: {},
        error: errorResponse,
      };
    }

    const { data } = await response.json();
    console.log("API key created successfully:", data);

    return {
      data,
      meta: {},
      error: undefined,
    };
  } catch (error: any) {
    console.error("Exception when calling createApiKey:", error.message);
    return {
      data: undefined,
      meta: {},
      error: {
        errors: [{ message: error.message, code: "internal_error", path: [] }],
        status: "Internal Server Error",
        statusCode: 500,
      },
    };
  }
}
