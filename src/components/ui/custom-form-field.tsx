import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/utils";

type Props = {
  form: any;
  formName: string;
  formTitle?: string;
  placeholder?: string;
  description?: string;
  isTextarea?: boolean;
  className?: string;
  inputType?: string;
  dataTestId?: string;
};

export default function CustomFormField({
  form,
  placeholder,
  formName,
  description,
  isTextarea,
  className,
  dataTestId,
  formTitle,
  inputType = "text",
}: Props) {
  return (
    <FormField
      control={form.control}
      name={formName}
      disabled={form.formState.isSubmitting}
      render={({ field }) => {
        // Define common props here, without className
        const commonProps = {
          ...field,
          placeholder: placeholder,
        };

        // Define base className
        const baseClassName = "placeholder:text-muted";

        return (
          <FormItem>
            <div className="flex w-full justify-between flex-wrap-reverse">
              <FormLabel>{formTitle}</FormLabel>
              <FormMessage className="text-xs" />
            </div>
            <FormControl>
              {isTextarea ? (
                <Textarea
                  {...commonProps}
                  className={cn(baseClassName, className, "")}
                />
              ) : (
                <Input
                  {...commonProps}
                  data-testid={dataTestId}
                  className={cn(baseClassName, className, "")}
                  type={inputType}
                />
              )}
            </FormControl>
            <FormDescription>{description}</FormDescription>
          </FormItem>
        );
      }}
    />
  );
}
