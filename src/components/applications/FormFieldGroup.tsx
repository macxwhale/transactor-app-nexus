
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ApplicationFormValues } from "./ApplicationForm";

interface FormFieldProps {
  form: UseFormReturn<ApplicationFormValues>;
  name: keyof ApplicationFormValues;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
}

const FormFieldGroup = ({ form, name, label, placeholder, description, disabled }: FormFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input 
              placeholder={placeholder} 
              {...field} 
              disabled={disabled}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormFieldGroup;
