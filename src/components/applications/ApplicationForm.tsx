
import React from "react";
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

// Update schema to reflect that app_id and app_secret are not part of the form
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
}

const ApplicationForm = ({
  onSubmit,
  defaultValues,
  isEditing = false,
  isSubmitting = false,
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>App Name</FormLabel>
                <FormControl>
                  <Input placeholder="My App" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="callback_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Callback URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://example.com/callback" 
                    {...field} 
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>Must start with https://</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="consumer_key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consumer Key</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="consumer_secret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consumer Secret</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="business_short_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Short Code</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passkey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passkey</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="bearer_token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bearer Token</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="party_a"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Party A</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="party_b"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Party B</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
