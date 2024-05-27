"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils/utils";
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
import { toast } from "sonner";
import { CreateVenueSchema } from "@/lib/validation/schemas";
import {
  CreateVenueType,
  VenueType,
  LocationType,
} from "@/lib/validation/types";
import { createVenue, updateVenue } from "@/lib/server/api/api.action";
import { useDebounce } from "@/lib/utils/hooks";
import { Input } from "@/components/ui/input";
import { ReloadIcon } from "@radix-ui/react-icons";
import { MdDelete } from "react-icons/md";
import { ArrowRight, CirclePlus } from "lucide-react";
import { Switch } from "../ui/switch";
import CustomFormField from "@/components/ui/custom-form-field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { redirect, useRouter } from "next/navigation";

export default function CreateVenueForm({
  isEditing = false,
  venue,
}: {
  isEditing?: boolean;
  venue?: VenueType;
}) {
  const [formStep, setFormStep] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [suggestions, setSuggestions] = useState<LocationType[]>([]);
  const isSelecting = useRef(false);

  const defaultValues =
    isEditing && venue
      ? {
          name: venue.name,
          description: venue.description,
          media: venue.media,
          price: venue.price,
          maxGuests: venue.maxGuests,
          rating: venue.rating,
          meta: venue.meta,
          location: venue.location,
        }
      : {
          name: "",
          description: "",
          media: [
            {
              url: "https://www.shutterstock.com/image-photo/new-modern-apartment-buildings-vancouver-260nw-2326087651.jpg",
              alt: "house exterior",
            },
          ],
          price: 0,
          maxGuests: 1,
          rating: 0,
          meta: {
            wifi: false,
            parking: false,
            breakfast: false,
            pets: false,
          },
          location: {
            address: "",
            city: "",
            zip: "",
            country: "",
            continent: "",
            lat: 0,
            lng: 0,
          },
        };

  const form = useForm<CreateVenueType>({
    resolver: zodResolver(CreateVenueSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    name: "media",
    control: form.control,
  });

  const fetchGeocode = async (address: string) => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch geocode");
    }
    const data = await response.json();
    if (!data.features || data.features.length === 0) {
      throw new Error("No results found");
    }
    return data.features.map((location: any) => {
      const context = location.context || [];
      return {
        address: location.place_name,
        city: context.find((c: any) => c.id.includes("place"))?.text || "",
        zip: context.find((c: any) => c.id.includes("postcode"))?.text || "",
        country: context.find((c: any) => c.id.includes("country"))?.text || "",
        continent:
          context.find((c: any) => c.id.includes("continent"))?.text || "",
        lat: location.geometry.coordinates[1],
        lng: location.geometry.coordinates[0],
      };
    });
  };

  const debouncedAddress = useDebounce(
    form.watch("location.address") ?? "",
    500
  );

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
      const locationData = await fetchGeocode(address);
      console.log("locationData", locationData);
      setSuggestions(locationData);
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

  async function onSubmit(data: CreateVenueType) {
    console.log("Submitted data", data);
    setIsLoading(true);
    try {
      const res =
        isEditing && venue
          ? await updateVenue(venue.id, data)
          : await createVenue(data);
      if (res.error) {
        console.error("An error occurred:", res.error);
        setHasError(true);
        setTimeout(() => setHasError(false), 1000); // Reset error state after 2 seconds
        res.error.errors.forEach((err: any) => toast.error(err.message));
        return;
      }
      toast.success(`Venue ${isEditing ? "updated" : "created"} successfully!`);
      console.log(`Venue ${isEditing ? "updated" : "created"}:`, res.data);

      const router = useRouter();
      router.replace(`/venue/${res.data?.id}`);
    } catch (error: any) {
      setHasError(true);
      setTimeout(() => setHasError(false), 1000);
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleNextStepClick() {
    const isValid = await form.trigger([
      "name",
      "description",
      "price",
      "maxGuests",
    ]);
    if (isValid) {
      setFormStep(1);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="">
        <CardTitle>{isEditing ? "Update Venue" : "Create Venue"}</CardTitle>
        <CardDescription className="">
          Fill out the form below to {isEditing ? "update" : "create"} a venue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 relative overflow-x-hidden p-2"
          >
            <motion.div
              className={cn("space-y-3 block", {
                hidden: formStep !== 0,
              })}
              animate={{
                translateX: `-${formStep * 100}%`,
              }}
              transition={{
                ease: "easeInOut",
              }}
            >
              <CustomFormField
                form={form}
                formName={"name"}
                formTitle={"Name"}
                description={"Enter the venue name here."}
                inputType="text"
              />
              <CustomFormField
                form={form}
                formName={"description"}
                formTitle={"Description"}
                description={"Enter the venue description here."}
                inputType="text"
              />
              <CustomFormField
                form={form}
                formName={"price"}
                formTitle={"Price"}
                description={"Enter the venue price here."}
                inputType="number"
              />
              <CustomFormField
                form={form}
                formName={"maxGuests"}
                formTitle={"Max Guests"}
                description={"Enter the maximum number of guests."}
                inputType="number"
              />
            </motion.div>
            <motion.div
              className={cn("space-y-3 p-2 block", {
                hidden: formStep !== 1,
              })}
              animate={{
                translateX: `${100 - formStep * 100}%`,
              }}
              style={{
                translateX: `${100 - formStep * 100}%`,
              }}
              transition={{
                ease: "easeInOut",
              }}
            >
              {/* Media URLs Field */}
              <div className="flex justify-between gap-1 pb-10">
                <div className="w-full">
                  {fields.map((field, index) => (
                    <FormField
                      control={form.control}
                      name={`media.${index}.alt`}
                      key={field.id}
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel className={cn(index !== 0 && "sr-only")}>
                            Media Alt Text
                          </FormLabel>
                          <FormControl>
                            <Input className="text-xs h-7" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <div className="w-1/2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-2">
                      <FormField
                        control={form.control}
                        name={`media.${index}.url`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className={cn(index !== 0 && "sr-only")}>
                              Media URL
                            </FormLabel>
                            <FormControl>
                              <Input className="text-xs h-7" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => remove(index)}
                          className="h-7 w-7"
                        >
                          <MdDelete className="text-md" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 absolute space-x-1"
                    onClick={() => append({ url: "", alt: "" })}
                  >
                    <CirclePlus className="h-4 w-4" />
                    <span>Add URL</span>
                  </Button>
                </div>
              </div>

              <FormField
                control={form.control}
                name="location.address"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start rounded-lg border p-4 relative">
                    <div className="space-y-0.5 mb-2">
                      <FormLabel className="text-base">Address</FormLabel>
                      <FormDescription>
                        Enter the venue address here.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <>
                        <Input
                          type="text"
                          value={field.value || ""}
                          onChange={(e) => {
                            isSelecting.current = false; // Reset selecting state on input change
                            field.onChange(e.target.value);
                          }}
                          ref={field.ref}
                        />
                        {suggestions.length > 0 && (
                          <div className="absolute -bottom-48 z-10 mt-2 w-full left-0 bg-white border border-gray-300 rounded-md shadow-lg">
                            {suggestions.map((suggestion, index) => (
                              <div
                                key={index}
                                className="p-2 cursor-pointer hover:bg-gray-200"
                                onClick={() =>
                                  handleSuggestionClick(suggestion)
                                }
                              >
                                {suggestion.address}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meta.wifi"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">WiFi</FormLabel>
                      <FormDescription>
                        Does the venue have WiFi?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="meta.parking"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Parking</FormLabel>
                      <FormDescription>
                        Does the venue have parking?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="meta.breakfast"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Breakfast</FormLabel>
                      <FormDescription>
                        Does the venue offer breakfast?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="meta.pets"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Pets</FormLabel>
                      <FormDescription>
                        Are pets allowed at the venue?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </motion.div>
            <div className="flex justify-end items-end gap-2">
              <Button
                type="button"
                className={cn({
                  hidden: formStep === 1,
                })}
                variant={"outline"}
                onClick={handleNextStepClick}
              >
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setFormStep(0);
                }}
                className={cn("ml-2", {
                  hidden: formStep === 0,
                })}
                variant={"outline"}
              >
                Go Back
              </Button>
              <Button
                type="submit"
                variant={hasError ? "destructive" : "default"}
                className={cn(
                  {
                    hidden: formStep === 0,
                  },
                  "w-20"
                )}
              >
                {isLoading ? <ReloadIcon className="animate-spin" /> : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
