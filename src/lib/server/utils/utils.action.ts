"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createStreamableValue } from "ai/rsc";
import { CoreMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import {
  APIResponse,
  ErrorObj,
  MetaType,
  LocationType,
} from "@/lib/validation/types";
import { MetaSchema } from "@/lib/validation/schemas";

export async function continueConversation(messages: CoreMessage[]) {
  "use server";
  const result = await streamText({
    model: openai("gpt-4-turbo"),
    messages,
  });
  const data = { test: "hello" };
  const stream = createStreamableValue(result.textStream);
  return { message: stream.value, data };
}

export async function logOut() {
  cookies().delete("accessToken");
  cookies().delete("username");
  revalidatePath("/", "layout");
}

const BASE_URL = "https://maps.googleapis.com/maps/api/place";

export async function fetchGooglePlacesAutocomplete(
  input: string
): Promise<APIResponse<LocationType[], MetaType>> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return {
      meta: MetaSchema.parse({}),
      error: {
        errors: [
          {
            message: "Google Maps API key is not configured",
            code: "api_key_missing",
            path: [],
          },
        ],
        status: "Error",
        statusCode: 500,
      },
    };
  }

  try {
    const response = await fetch(
      `${BASE_URL}/autocomplete/json?input=${encodeURIComponent(
        input
      )}&key=${apiKey}`
    );

    if (!response.ok) {
      const errorResponse: ErrorObj = await response.json();
      return {
        meta: MetaSchema.parse({}),
        error: errorResponse,
      };
    }

    const data = await response.json();

    if (!data.predictions || data.predictions.length === 0) {
      return {
        meta: MetaSchema.parse({}),
        error: {
          errors: [
            {
              message: "No results found",
              code: "no_results",
              path: [],
            },
          ],
          status: "Error",
          statusCode: 404,
        },
      };
    }

    const placeDetails = await Promise.all(
      data.predictions.map(async (prediction: any) => {
        const detailsResponse = await fetch(
          `${BASE_URL}/details/json?place_id=${prediction.place_id}&key=${apiKey}`
        );
        if (!detailsResponse.ok) {
          throw new Error(
            `Failed to fetch place details for ${prediction.place_id}`
          );
        }
        const detailsData = await detailsResponse.json();
        const location = detailsData.result.geometry.location;
        return {
          address: detailsData.result.formatted_address,
          city:
            detailsData.result.address_components.find((c: any) =>
              c.types.includes("locality")
            )?.long_name || "",
          zip:
            detailsData.result.address_components.find((c: any) =>
              c.types.includes("postal_code")
            )?.long_name || "",
          country:
            detailsData.result.address_components.find((c: any) =>
              c.types.includes("country")
            )?.long_name || "",
          continent: "", // Google Places API doesn't provide continent information directly
          lat: location.lat,
          lng: location.lng,
        };
      })
    );

    return {
      data: placeDetails,
      meta: MetaSchema.parse({}),
    };
  } catch (error: any) {
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
