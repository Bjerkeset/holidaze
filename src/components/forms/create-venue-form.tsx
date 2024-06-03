"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import React, { useState, useEffect, useRef } from "react";
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
import { CreateVenueType, VenueType } from "@/lib/validation/types";
import { createVenue, updateVenue } from "@/lib/server/api/api.action";
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
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/utils";
import LocationInput from "../widgets/location-input";
import { useMediaQuery } from "@/lib/utils/hooks";

export default function CreateVenueForm({
  isEditing = false,
  venue,
}: {
  isEditing?: boolean;
  venue?: VenueType;
}) {
  const [formStep, setFormStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width: 850px)");
  const router = useRouter();

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
          maxGuests: 0,
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

  async function onSubmit(data: CreateVenueType) {
    setIsLoading(true);
    try {
      const res =
        isEditing && venue
          ? await updateVenue(venue.id, data)
          : await createVenue(data);
      if (res.error) {
        console.error("An error occurred:", res.error);
        setHasError(true);
        setTimeout(() => setHasError(false), 1000);
        res.error.errors.forEach((err: any) => toast.error(err.message));
        return;
      }
      toast.success(`Venue ${isEditing ? "updated" : "created"} successfully!`);

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
            className="space-y-3 relative overflow-x-hidden p-2 w-full"
          >
            {isLargeScreen ? (
              <div className=" flex gap-4">
                <div className="space-y-3  w-1/2  pt-3">
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
                    className="h-56"
                    isTextarea
                  />
                  <CustomFormField
                    form={form}
                    formName={"price"}
                    formTitle={"Price"}
                    description={"Enter the venue price in USD."}
                    inputType="number"
                  />
                  <CustomFormField
                    form={form}
                    formName={"maxGuests"}
                    formTitle={"Max Guests"}
                    description={"Enter the maximum number of guests."}
                    inputType="number"
                  />
                </div>
                <div className="space-y-4 p-2 w-1/2">
                  <div className="flex justify-between gap-1 pb-10">
                    <div className="w-full">
                      {fields.map((field, index) => (
                        <FormField
                          control={form.control}
                          name={`media.${index}.alt`}
                          key={field.id}
                          render={({ field }) => (
                            <FormItem className="">
                              <FormLabel
                                className={cn(index !== 0 && "sr-only")}
                              >
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
                                <FormLabel
                                  className={cn(
                                    "text-nowrap",
                                    index !== 0 && "sr-only "
                                  )}
                                >
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
                              variant="ghost"
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
                        variant="ghost"
                        size="sm"
                        className="mt-2 absolute space-x-1"
                        onClick={() => append({ url: "", alt: "" })}
                      >
                        <CirclePlus className="h-4 w-4" />
                        <span className="">Add URL</span>
                      </Button>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="location.address"
                    render={({ field }) => (
                      <LocationInput field={field} form={form} />
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
                </div>
              </div>
            ) : (
              <>
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
                    className="h-56"
                    isTextarea
                  />
                  <CustomFormField
                    form={form}
                    formName={"price"}
                    formTitle={"Price"}
                    description={"Enter the venue price in USD."}
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
                  <div className="flex justify-between gap-1 pb-10 flex-col ">
                    <div className="w-full">
                      {fields.map((field, index) => (
                        <FormField
                          control={form.control}
                          name={`media.${index}.alt`}
                          key={field.id}
                          render={({ field }) => (
                            <FormItem className="">
                              <FormLabel
                                className={cn(index !== 0 && "sr-only")}
                              >
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
                    <div className="">
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex items-end gap-2 ">
                          <FormField
                            control={form.control}
                            name={`media.${index}.url`}
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel
                                  className={cn(
                                    "text-nowrap",
                                    index !== 0 && "sr-only text-nowrap"
                                  )}
                                >
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
                              variant="ghost"
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
                        variant="ghost"
                        size="sm"
                        className="mt-2 absolute space-x-1"
                        onClick={() => append({ url: "", alt: "" })}
                      >
                        <CirclePlus className="h-4 w-4" />
                        <span className="text-xs ">Add URL</span>
                      </Button>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="location.address"
                    render={({ field }) => (
                      <LocationInput field={field} form={form} />
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
              </>
            )}
            <div className="flex justify-end items-end gap-2">
              {!isLargeScreen && (
                <>
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
                </>
              )}
              <Button
                type="submit"
                variant={hasError ? "destructive" : "default"}
                className={cn(
                  {
                    hidden: formStep === 0 && !isLargeScreen,
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
