
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { apiClient } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Link } from "lucide-react";

const configSchema = z.object({
  apiDomain: z
    .string()
    .url("Must be a valid URL")
    .refine((val) => val.startsWith("https://"), {
      message: "API domain must use HTTPS",
    }),
});

type ConfigFormValues = z.infer<typeof configSchema>;

interface ApiDomainFormProps {
  initialDomain: string;
  onDomainChange: (domain: string) => void;
}

const ApiDomainForm = ({ initialDomain, onDomainChange }: ApiDomainFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      apiDomain: initialDomain || "",
    },
  });

  const onSubmit = async (data: ConfigFormValues) => {
    setIsLoading(true);
    
    try {
      // Save to database instead of localStorage
      const { error } = await supabase
        .from('api_configurations')
        .upsert(
          { 
            key: 'apiDomain', 
            value: data.apiDomain, 
            description: 'The base URL for all API requests'
          },
          { onConflict: 'key' }
        );
      
      if (error) {
        throw error;
      }
      
      // Update the local state via callback
      onDomainChange(data.apiDomain);
      
      // Update the API client's base URL
      apiClient.setBaseUrl(data.apiDomain);
      
      toast.success("API configuration updated successfully");
    } catch (error) {
      console.error("Failed to update configuration:", error);
      toast.error("Failed to update configuration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id="config-form" className="space-y-4">
        <FormField
          control={form.control}
          name="apiDomain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Domain</FormLabel>
              <FormControl>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="https://example.com" 
                    className="pl-10"
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormDescription>
                This will be used as the base URL for all API requests.
                Example: https://bunisystems.wauminisacco.co.ke
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          form="config-form"
          variant="gradient"
          disabled={isLoading || !form.formState.isDirty}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⏳</span>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Configuration
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ApiDomainForm;
