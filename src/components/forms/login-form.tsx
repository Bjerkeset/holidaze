"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/ui/custom-form-field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/server/api/api.action";
import { toast } from "sonner";
import { cookies } from "next/headers";
import { LoginSchema } from "@/lib/validation/schemas";
import { LoginType } from "@/lib/validation/types";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginType) {
    setIsLoading(true);
    try {
      const res = await loginUser(values);
      if (res.error) {
        console.error("An error occurred:", res.error);
        res.error.errors.forEach((err) => toast.error(err.message));
        setIsLoading(false);
        return;
      }
      toast.success("User logged in successfully!");
      // res.data.accessToken
      // cookies().set('name', res.data?.accessToken)
      router.push("/"); // Redirect to a dashboard or appropriate page
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Sign in </CardTitle>
        <CardDescription>Fill out the form to sign in.</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6 w-full justify-between  min-h-[400px]"
          >
            <div className="space-y-6">
              <CustomFormField
                form={form}
                formName="email"
                formTitle="Email"
                description="Enter your email to log in."
              />
              <CustomFormField
                form={form}
                formName="password"
                formTitle="Password"
                description="Enter your password to log in."
                inputType="password"
              />
            </div>

            <Button className="" type="submit" disabled={isLoading}>
              {isLoading ? <ReloadIcon className="animate-spin" /> : "Log In"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
