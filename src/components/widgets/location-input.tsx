"use client";

import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/lib/utils/hooks";
import { fetchGooglePlacesAutocomplete } from "@/lib/server/utils/utils.action";
import { LocationType } from "@/lib/validation/types";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type LocationInputProps = {
  field: any;
  form: any;
};

export default function LocationInput({ field, form }: LocationInputProps) {
  const [suggestions, setSuggestions] = useState<LocationType[]>([]);
  const isSelecting = useRef(false);
  const suggestionsContainerRef = useRef<HTMLDivElement>(null);
  const debouncedAddress = useDebounce(field.value ?? "", 500);

  useEffect(() => {
    if (debouncedAddress && !isSelecting.current) {
      handleAddressChange(debouncedAddress);
    }
  }, [debouncedAddress]);

  const handleAddressChange = async (address: string) => {
    if (isSelecting.current) {
      isSelecting.current = false;
      return;
    }
    try {
      const locationData = await fetchGooglePlacesAutocomplete(address);
      if (locationData.error) {
        throw new Error(locationData.error.errors[0].message);
      }
      setSuggestions(locationData.data!);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch location details");
    }
  };

  const handleSuggestionClick = (suggestion: LocationType) => {
    isSelecting.current = true; // Set selecting state to true
    form.setValue("location.address", suggestion.address);
    form.setValue("location.city", suggestion.city);
    form.setValue("location.zip", suggestion.zip);
    form.setValue("location.country", suggestion.country);
    form.setValue("location.continent", suggestion.continent);
    form.setValue("location.lat", suggestion.lat);
    form.setValue("location.lng", suggestion.lng);
    setSuggestions([]); // Clear suggestions after selection
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      suggestionsContainerRef.current &&
      !suggestionsContainerRef.current.contains(event.target as Node)
    ) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <FormItem className="flex flex-col items-start rounded-lg border p-4 relative">
      <div className="space-y-0.5 mb-2">
        <FormLabel className="text-base">Address</FormLabel>
        <FormDescription>Enter the venue address here.</FormDescription>
      </div>
      <FormControl>
        <>
          <Input
            type=""
            value={field.value || ""}
            onChange={(e) => {
              isSelecting.current = false; // Reset selecting state on input change
              field.onChange(e.target.value);
            }}
            ref={field.ref}
          />
          {suggestions.length > 0 && (
            <div
              className="absolute mt-2 top-[108px] left-4 right-4 z-50 bg-white border border-gray-300 rounded-md shadow-lg"
              ref={suggestionsContainerRef}
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.address}
                </div>
              ))}
            </div>
          )}
        </>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
