
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import AppCredentialsSection from "./AppCredentialsSection";
import FormFieldGroup from "./FormFieldGroup";

// Schema definition
const applicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  callback_url: z.string().url("Must be a valid URL starting with https://"),
  consumer_key: z.string().min(1, "Consumer key is required"),
  consumer_secret: z.string().min(1, "Consumer secret is required"),
  business_short_code: z.string().min(1, "Business short code is required"),
  passkey: z.string().min(1, "Passkey is required"),
  bearer_token: z.string().min(1, "Bearer token is required"),
  party_a: z.string().min(1, "Party A is required"),
  party_b: z.string().min(1, "Party B is required"),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  onSubmit: (data: ApplicationFormValues) => void;
  defaultValues?: Partial<ApplicationFormValues>;
  isEditing?: boolean;
  isSubmitting?: boolean;
  appCredentials?: {
    app_id?: string;
    app_secret?: string;
  };
}

const ApplicationForm = ({
  onSubmit,
  defaultValues,
  isEditing = false,
  isSubmitting = false,
  appCredentials,
}: ApplicationFormProps) => {
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: defaultValues || {
      name: "",
      callback_url: "",
      consumer_key: "",
      consumer_secret: "",
      business_short_code: "",
      passkey: "",
      bearer_token: "",
      party_a: "",
      party_b: "",
    },
  });

  // Function to handle form submission
  const handleSubmit = (data: ApplicationFormValues) => {
    // Only submit if not already submitting
    if (!isSubmitting) {
      onSubmit(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldGroup
            form={form}
            name="name"
            label="App Name"
            placeholder="My App"
            disabled={isSubmitting}
          />
          <FormFieldGroup
            form={form}
            name="callback_url"
            label="Callback URL"
            placeholder="https://example.com/callback"
            description="Must start with https://"
            disabled={isSubmitting}
          />
        </div>

        {/* App credentials section - only shown when editing */}
        {isEditing && appCredentials && (
          <AppCredentialsSection 
            appId={appCredentials.app_id} 
            appSecret={appCredentials.app_secret} 
          />
        )}

        {/* Consumer Keys */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldGroup
            form={form}
            name="consumer_key"
            label="Consumer Key"
            disabled={isSubmitting}
          />
          <FormFieldGroup
            form={form}
            name="consumer_secret"
            label="Consumer Secret"
            disabled={isSubmitting}
          />
        </div>

        {/* Business Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldGroup
            form={form}
            name="business_short_code"
            label="Business Short Code"
            disabled={isSubmitting}
          />
          <FormFieldGroup
            form={form}
            name="passkey"
            label="Passkey"
            disabled={isSubmitting}
          />
        </div>

        {/* Bearer Token */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <FormFieldGroup
            form={form}
            name="bearer_token"
            label="Bearer Token"
            disabled={isSubmitting}
          />
        </div>

        {/* Party Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldGroup
            form={form}
            name="party_a"
            label="Party A"
            disabled={isSubmitting}
          />
          <FormFieldGroup
            form={form}
            name="party_b"
            label="Party B"
            disabled={isSubmitting}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Registering..."}
            </>
          ) : (
            isEditing ? "Update Application" : "Register Application"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ApplicationForm;
