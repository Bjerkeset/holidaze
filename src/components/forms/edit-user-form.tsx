// File: EditUserForm.tsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CustomFormField from "../ui/custom-form-field";
import { updateUser } from "@/lib/server/api/api.action";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GoGear } from "react-icons/go";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UpdateProfileSchema } from "@/lib/validation/schemas"; // Import the schema
import { Switch } from "../ui/switch";
import { ProfileType } from "@/lib/validation/types";
import { cn } from "@/lib/utils/utils";

const formSchema = UpdateProfileSchema;

type FormValues = z.infer<typeof formSchema>;

type Props = {
  user: ProfileType;
  isEdit?: boolean;
};

export default function EditUserForm({ user, isEdit }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: user.bio,
      avatar: user.avatar
        ? { url: user.avatar.url, alt: "User avatar" }
        : undefined,
      banner: user.avatar.alt
        ? { url: user.banner.url, alt: "User banner" }
        : undefined,
      venueManager: user.venueManager,
    },
  });

  useEffect(() => {
    if (isEdit) {
      setOpen(true);
    }
  }, [isEdit]);

  async function onSubmit(values: FormValues) {
    try {
      const response = await updateUser(user.name, values);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(buttonVariants({ variant: "outline" }), "z-50")}
      >
        <GoGear className="w-5 h-5" />
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CustomFormField
              form={form}
              formName={"bio"}
              isTextarea
              formTitle={"Bio"}
            />
            <CustomFormField
              form={form}
              formName={"avatar.url"}
              formTitle={"Avatar Image Url"}
            />
            <CustomFormField
              form={form}
              formName={"banner.url"}
              formTitle={"Banner Image Url"}
            />
            <FormField
              control={form.control}
              name="venueManager"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Venue Manager</FormLabel>
                    <FormDescription>
                      Become a venue manager to create and manage venues.
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
            <Button type="submit" className="">
              Update
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
