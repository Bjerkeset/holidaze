"use client";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { cn } from "@/lib/utils/utils";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { loginUser, registerUser } from "@/lib/server/api/api.action";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import CustomFormField from "@/components/ui/custom-form-field";

import { ReloadIcon } from "@radix-ui/react-icons";
import { RegistrationSchema } from "@/lib/validation/schemas";
import { RegistrationType } from "@/lib/validation/types";

export default function RegisterForm() {
  const router = useRouter();
  const [formStep, setFormStep] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const form = useForm<RegistrationType>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      venueManager: false,
    },
  });

  async function onSubmit(data: RegistrationType) {
    setIsLoading(true);
    try {
      const res = await registerUser(data);
      if (res.error) {
        console.error("An error occurred:", res.error);
        setHasError(true);
        setTimeout(() => setHasError(false), 1000);
        res.error.errors.forEach((err) => toast.error(err.message));
        return;
      }
      toast.success("User registered successfully!");
      const loginResponse = await loginUser({
        email: data.email,
        password: data.password,
      });
      if (loginResponse.error) {
        loginResponse.error.errors.forEach((err) => toast.error(err.message));
        return;
      }
      router.push("/");
    } catch (error: any) {
      setHasError(true);
      setTimeout(() => setHasError(false), 1000);
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleNextStepClick() {
    const isValid = await form.trigger(["email", "name"]);
    if (isValid) {
      setFormStep(1);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="">
        <CardTitle>Register</CardTitle>
        <CardDescription className="">
          Fill out the form below to Register
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 relative overflow-x-hidden p-2 h-[400px]"
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
              {/* Email */}
              <CustomFormField
                form={form}
                formName={"email"}
                formTitle={"Email"}
                description={"Enter your email here."}
                inputType="email"
              />
              {/* Name */}
              <CustomFormField
                form={form}
                formName={"name"}
                formTitle={"username"}
                description={"Enter your name here."}
                inputType="name"
              />
              {/* Venue manager switch */}
              <FormField
                control={form.control}
                name="venueManager"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Venue Manager</FormLabel>
                      <FormDescription>
                        Will you be managing a venue?
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
            <motion.div
              className={cn("space-y-3 p-2 block", {
                hidden: formStep !== 1, // This will apply 'hidden' class if formStep is not 1
              })}
              animate={{
                translateX: `${100 - formStep * 100}%`,
              }}
              // defult style prevents the animation from running on page load.
              style={{
                translateX: `${100 - formStep * 100}%`,
              }}
              transition={{
                ease: "easeInOut",
              }}
            >
              {/* Password */}
              <CustomFormField
                form={form}
                formName={"password"}
                formTitle={"Password"}
                description={"Enter your password here."}
                inputType="password"
              />
              {/* Comfirm Password */}
              <CustomFormField
                form={form}
                formName={"confirmPassword"}
                formTitle={"Confirm Password"}
                description={"Confirm your password here."}
                inputType="password"
              />
            </motion.div>
            <div className="absolute bottom-0 right-0 ">
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
                  "w-25 ml-2"
                )}
              >
                {isLoading ? (
                  <ReloadIcon className="animate-spin" />
                ) : (
                  "Register Now"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
