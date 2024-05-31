"use server";
// File: api.action.ts
import {
  APIResponse,
  BookingType,
  CreateVenueResponseType,
  CreateVenueType,
  ErrorObj,
  FetchBookingsParams,
  LoginType,
  MetaType,
  ProfileType,
  RegistrationType,
  UpdateUserRequestType,
  VenueType,
} from "@/lib/validation/types";
import {
  VenueArraySchema,
  VenueSchema,
  MetaSchema,
  BookingSchema,
  ApiKeyType,
  BaseProfileSchema,
  CreateVenueSchema,
} from "@/lib/validation/schemas";
import { cookies } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const BASE = "https://v2.api.noroff.dev";

export async function createVenue(
  venueData: z.infer<typeof CreateVenueSchema>
): Promise<APIResponse<VenueType, MetaType>> {
  try {
    // Validate the input data
    CreateVenueSchema.parse(venueData);

    const accessToken = cookies().get("accessToken")?.value.toString();
    if (!accessToken) {
      console.error("Access token not found!");
      return {
        meta: {},
        error: {
          errors: [
            {
              message: "Access token not found",
              code: "access_token_missing",
              path: [],
            },
          ],
          status: "Error",
          statusCode: 401,
        },
      };
    }

    const apiKeyResponse = await createApiKey(accessToken, "Create Venue");
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

    const apiKey = apiKeyResponse.data.key;

    const response = await fetch(`${BASE}/holidaze/venues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      },
      body: JSON.stringify(venueData),
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

    if (jsonResponse && jsonResponse.data) {
      return {
        data: jsonResponse.data,
        meta: jsonResponse.meta,
      };
    } else {
      throw new Error(
        "Received data is not in expected format: expected a single venue object"
      );
    }
  } catch (error: any) {
    console.error("Failed to create venue:", error.message);
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

export async function updateVenue(
  venueId: string,
  venueData: Partial<CreateVenueType>
): Promise<APIResponse<VenueType, MetaType>> {
  try {
    // Validate the input data
    CreateVenueSchema.partial().parse(venueData);

    const accessToken = cookies().get("accessToken")?.value.toString();
    if (!accessToken) {
      console.error("Access token not found!");
      return {
        meta: {},
        error: {
          errors: [
            {
              message: "Access token not found",
              code: "access_token_missing",
              path: [],
            },
          ],
          status: "Error",
          statusCode: 401,
        },
      };
    }

    const apiKeyResponse = await createApiKey(accessToken, "Update Venue");
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

    const apiKey = apiKeyResponse.data.key;

    const response = await fetch(`${BASE}/holidaze/venues/${venueId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      },
      body: JSON.stringify(venueData),
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

    if (jsonResponse && jsonResponse.data) {
      revalidatePath(`/venue/${venueId}`);
      return {
        data: jsonResponse.data,
        meta: jsonResponse.meta,
      };
    } else {
      throw new Error(
        "Received data is not in expected format: expected a single venue object"
      );
    }
  } catch (error: any) {
    console.error("Failed to update venue:", error.message);
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

export async function createBooking({
  dateFrom,
  dateTo,
  guests,
  venueId,
}: {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
}): Promise<APIResponse<BookingType>> {
  const accessToken = cookies().get("accessToken")?.value.toString();
  if (!accessToken) {
    console.error("Access token not found!");
    return {
      meta: {},
      error: {
        errors: [
          {
            message: "Access token not found",
            code: "access_token_missing",
            path: [],
          },
        ],
        status: "Error",
        statusCode: 401,
      },
    };
  }
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

    const res = await response.json();
    if (res && res.data) {
      console.log("Booking created successfully:", res.data);
      // const data = BookingSchema.parse(jsonResponse.data);
      return {
        data: res.data,
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

export async function fetchBookingsByProfile({
  profileName,
  includeCustomer = true,
  includeVenue = true,
}: {
  profileName: string;
  includeCustomer?: boolean;
  includeVenue?: boolean;
}): Promise<APIResponse<Array<BookingType>, MetaType>> {
  const accessToken = cookies().get("accessToken")?.value.toString();
  if (!accessToken) {
    console.error("Access token not found!");
    return {
      meta: MetaSchema.parse({}),
      error: {
        errors: [
          {
            message: "Access token not found",
            code: "access_token_missing",
            path: [],
          },
        ],
        status: "Error",
        statusCode: 401,
      },
    };
  }
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
      `${BASE}/holidaze/profiles/${profileName}/bookings?${queryParameters}`,
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
        console.error("--- At fetchBookingsByProfile() -->", err.message)
      );
      return {
        meta: MetaSchema.parse({}),
        error: errorResponse,
      };
    }

    const jsonResponse = await response.json();
    console.log("API Response:", jsonResponse);

    const data = jsonResponse.data.map((item: any) => {
      const booking = BookingSchema.parse(item);
      return {
        ...booking,
        venue: item.venue ? VenueSchema.parse(item.venue) : null,
      };
    });
    const meta = MetaSchema.parse(jsonResponse.meta);

    return {
      data,
      meta,
      error: undefined,
    };
  } catch (error: any) {
    console.error("Failed to fetch bookings by profile:", error.message);
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

export async function fetchBookings({
  includeCustomer,
  includeVenue,
}: FetchBookingsParams): Promise<APIResponse<Array<BookingType>, MetaType>> {
  const accessToken = cookies().get("accessToken")?.value.toString();
  if (!accessToken) {
    console.error("Access token not found!");
    return {
      meta: MetaSchema.parse({}),
      error: {
        errors: [
          {
            message: "Access token not found",
            code: "access_token_missing",
            path: [],
          },
        ],
        status: "Error",
        statusCode: 401,
      },
    };
  }
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
// Due to api limitations, we fetch all venues in multiple requests,
// filter the venues with coordinates in Europe.
// Then return the filtered venues.
export async function fetchAllVenuesInEurope(): Promise<
  APIResponse<VenueType[], MetaType>
> {
  const limit = 100;
  let currentPage = 1;
  let totalVenues: VenueType[] = [];
  let isLastPage = false;

  try {
    while (!isLastPage) {
      const queryParameters = new URLSearchParams({
        _owner: "true",
        limit: limit.toString(),
        page: currentPage.toString(),
      });

      const response = await fetch(
        `${BASE}/holidaze/venues?${queryParameters.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorResponse: ErrorObj = await response.json();
        console.error("HTTP error! Status:", response.status, errorResponse);
        return {
          meta: MetaSchema.parse({}),
          error: errorResponse,
        };
      }

      const res = await response.json();

      if (res && Array.isArray(res.data)) {
        // Filter venues within Europe
        const filteredData = res.data.filter((venue: VenueType) => {
          const { lat, lng } = venue.location;
          return (
            lat !== null &&
            lng !== null &&
            lat >= 34.0 &&
            lat <= 71.0 &&
            lng >= -25.0 &&
            lng <= 45.0
          );
        });

        totalVenues = totalVenues.concat(filteredData);
        isLastPage = res.meta.isLastPage;
        currentPage = res.meta.nextPage || currentPage + 1;
      } else {
        throw new Error("Received data is not in expected format: array");
      }
    }

    return {
      data: totalVenues,
      meta: MetaSchema.parse({
        isFirstPage: true,
        isLastPage: true,
        currentPage: 1,
        previousPage: null,
        nextPage: null,
        pageCount: Math.ceil(totalVenues.length / limit),
        totalCount: totalVenues.length,
      }),
    };
  } catch (error: any) {
    console.error("Failed to fetch venues:", error.message);
    return {
      meta: MetaSchema.parse({}),
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

// Function to search venues by name or description and filter them based on coordinates within Europe
export async function searchVenuesInEurope(
  query: string
): Promise<APIResponse<VenueType[], MetaType>> {
  try {
    const queryParams = new URLSearchParams({ q: query });

    const response = await fetch(
      `${BASE}/holidaze/venues/search?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorResponse: ErrorObj = await response.json();
      console.error("HTTP error! Status:", response.status, errorResponse);
      return {
        meta: MetaSchema.parse({}),
        error: errorResponse,
      };
    }

    const res = await response.json();

    if (res && Array.isArray(res.data)) {
      // Filter venues within Europe
      const filteredData = res.data.filter((venue: VenueType) => {
        const { lat, lng } = venue.location;
        return (
          lat !== null &&
          lng !== null &&
          lat >= 34.0 &&
          lat <= 71.0 &&
          lng >= -25.0 &&
          lng <= 45.0
        );
      });

      return {
        data: filteredData,
        meta: MetaSchema.parse(res.meta),
      };
    } else {
      throw new Error("Received data is not in expected format: array");
    }
  } catch (error: any) {
    console.error("Failed to search venues:", error.message);
    return {
      meta: MetaSchema.parse({}),
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

export async function fetchVenuesByProfile(
  name: string,
  {
    limit = 100,
    page = 1,
    owner = true,
    booking = true,
  }: { limit?: number; page?: number; owner?: boolean; booking?: boolean } = {}
): Promise<APIResponse<VenueType[], MetaType>> {
  const accessToken = cookies().get("accessToken")?.value.toString();
  if (!accessToken) {
    console.error("Access token not found!");
    return {
      meta: MetaSchema.parse({}),
      error: {
        errors: [
          {
            message: "Access token not found",
            code: "access_token_missing",
            path: [],
          },
        ],
        status: "Error",
        statusCode: 401,
      },
    };
  }

  const apiKeyResponse = await createApiKey(
    accessToken,
    "Fetch Venues by Profile"
  );
  if (apiKeyResponse.error || !apiKeyResponse.data) {
    console.error(
      "Failed to retrieve API Key:",
      apiKeyResponse.error || "No API key received"
    );
    return {
      meta: MetaSchema.parse({}),
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

  const apiKey = apiKeyResponse.data.key;

  const queryParameters = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    _owner: owner.toString(),
    _bookings: booking.toString(),
  });

  try {
    const response = await fetch(
      `${BASE}/holidaze/profiles/${name}/venues?${queryParameters}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey,
        },
      }
    );

    if (!response.ok) {
      const errorResponse: ErrorObj = await response.json();
      console.error("HTTP error! Status:", response.status, errorResponse);
      return {
        meta: MetaSchema.parse({}),
        error: errorResponse,
      };
    }

    const res = await response.json();

    if (res && Array.isArray(res.data)) {
      const data = res.data.map((item: any) => {
        // Ensure owner and bookings fields are present
        return VenueSchema.parse({
          ...item,
          owner: item.owner || null,
          bookings: item.bookings || [],
        });
      });
      const meta = MetaSchema.parse(res.meta);

      return {
        data,
        meta,
      };
    } else {
      throw new Error("Received data is not in expected format: array");
    }
  } catch (error: any) {
    console.error("Failed to fetch venues by profile:", error.message);
    return {
      meta: MetaSchema.parse({}),
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

export async function fetchVenueById(
  id: string,
  {
    limit = 100,
    page = 1,
    owner = true,
    booking = true,
  }: { limit?: number; page?: number; owner?: boolean; booking?: boolean } = {}
): Promise<APIResponse<VenueType>> {
  const queryParameters = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    _owner: owner.toString(),
    _bookings: booking.toString(),
  });

  try {
    const response = await fetch(
      `${BASE}/holidaze/venues/${id}?${queryParameters.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorResponse: ErrorObj = await response.json();
      console.error("HTTP error! Status:", response.status, errorResponse);
      return {
        meta: {},
        error: errorResponse,
      };
    }

    const res = await response.json();

    if (res && res.data) {
      return {
        data: res.data,
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

// Function to fetch all venues with pagination and sorting
export async function fetchAllVenues({
  limit = 24,
  page = 1,
  sort = "rating",
  sortOrder = "desc",
} = {}): Promise<APIResponse<VenueType[], MetaType>> {
  try {
    const response = await fetch(
      `${BASE}/holidaze/venues?limit=${limit}&page=${page}&sort=${sort}&_owner=true&sortOrder=${sortOrder}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorResponse: ErrorObj = await response.json();
      console.error("HTTP error! Status:", response.status, errorResponse);
      return {
        meta: MetaSchema.parse({}),
        error: errorResponse,
      };
    }

    const res = await response.json();

    if (res && Array.isArray(res.data)) {
      return {
        data: res.data,
        meta: MetaSchema.parse(res.meta),
      };
    } else {
      throw new Error("Received data is not in expected format: array");
    }
  } catch (error: any) {
    console.error("Failed to fetch venues:", error.message);
    return {
      meta: MetaSchema.parse({}),
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
    cookies().set("accessToken", data.accessToken);
    cookies().set("username", data.name);

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

export async function updateUser(
  name: string,
  updateData: UpdateUserRequestType
): Promise<APIResponse<ProfileType>> {
  try {
    const accessToken = cookies().get("accessToken")?.value.toString();
    if (!accessToken) {
      console.error("Access token not found!");
      return {
        meta: {},
        error: {
          errors: [
            {
              message: "Access token not found",
              code: "access_token_missing",
              path: [],
            },
          ],
          status: "Error",
          statusCode: 401,
        },
      };
    }

    const apiKeyResponse = await createApiKey(accessToken, "Update User");
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

    const apiKey = apiKeyResponse.data.key;

    const response = await fetch(`${BASE}/holidaze/profiles/${name}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorResponse: ErrorObj = await response.json();
      console.error("HTTP error! Status:", response.status, errorResponse);
      return {
        meta: {},
        error: errorResponse,
      };
    }

    const res = await response.json();

    if (res && res.data) {
      return {
        data: res.data,
        meta: {},
      };
    } else {
      throw new Error(
        "Received data is not in expected format: expected a single profile object"
      );
    }
  } catch (error: any) {
    console.error("Failed to update user:", error.message);
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

export async function fetchProfileByName(
  name: string
): Promise<APIResponse<ProfileType>> {
  try {
    const accessToken = cookies().get("accessToken")?.value.toString();
    if (!accessToken) {
      console.error("Access token not found!");
      return {
        meta: {},
        error: {
          errors: [
            {
              message: "Access token not found",
              code: "access_token_missing",
              path: [],
            },
          ],
          status: "Error",
          statusCode: 401,
        },
      };
    }

    const apiKeyResponse = await createApiKey(accessToken, "Fetch Profile");
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

    const apiKey = apiKeyResponse.data.key; // Assuming this is how the key is accessed
    const response = await fetch(`${BASE}/holidaze/profiles/${name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
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

    const res = await response.json();
    if (res && res.data) {
      return {
        data: res.data,
        meta: {},
      };
    } else {
      throw new Error(
        "Received data is not in expected format: expected a single profile object"
      );
    }
  } catch (error: any) {
    console.error("Failed to fetch profile:", error.message);
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

export async function deleteVenue(venueId: string): Promise<APIResponse<null>> {
  try {
    const accessToken = cookies().get("accessToken")?.value.toString();
    if (!accessToken) {
      console.error("Access token not found!");
      return {
        meta: {},
        error: {
          errors: [
            {
              message: "Access token not found",
              code: "access_token_missing",
              path: [],
            },
          ],
          status: "Error",
          statusCode: 401,
        },
      };
    }

    const apiKeyResponse = await createApiKey(accessToken, "Delete Venue");
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

    const apiKey = apiKeyResponse.data.key;

    const response = await fetch(`${BASE}/holidaze/venues/${venueId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
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

    return {
      data: null,
      meta: {},
    };
  } catch (error: any) {
    console.error("Failed to delete venue:", error.message);
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
