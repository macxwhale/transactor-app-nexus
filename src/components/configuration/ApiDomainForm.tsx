
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
import { Save, Link, TestTube } from "lucide-react";

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
  const [isTesting, setIsTesting] = useState(false);

  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      apiDomain: initialDomain || "",
    },
  });

  const testApiConnection = async (domain: string) => {
    setIsTesting(true);
    try {
      console.log("Testing API connection to:", domain);
      
      // Temporarily set the API client base URL for testing
      const originalBaseUrl = apiClient.getBaseUrl();
      apiClient.setBaseUrl(domain);
      
      // Try to make a simple request to test connectivity
      // This is a basic connectivity test - adjust endpoint as needed
      const response = await fetch(`${domain}/health`, {
        method: 'GET',
        mode: 'cors',
      });
      
      if (response.ok) {
        toast.success("API connection test successful!");
      } else {
        toast.warning(`API responded with status ${response.status}. This may still work for your use case.`);
      }
      
      // Restore original base URL if test fails
      if (originalBaseUrl) {
        apiClient.setBaseUrl(originalBaseUrl);
      }
      
    } catch (error) {
      console.error("API connection test failed:", error);
      toast.warning("Could not connect to API. Please verify the domain is correct and accessible.");
    } finally {
      setIsTesting(false);
    }
  };

  const onSubmit = async (data: ConfigFormValues) => {
    setIsLoading(true);
    
    try {
      console.log("Saving API configuration:", data.apiDomain);
      
      // Save to database
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
        console.error("Database save error:", error);
        throw error;
      }
      
      // Update the local state via callback
      onDomainChange(data.apiDomain);
      
      // Update the API client's base URL
      apiClient.setBaseUrl(data.apiDomain);
      
      toast.success("API configuration saved successfully");
      console.log("API configuration saved and client updated");
      
    } catch (error) {
      console.error("Failed to update configuration:", error);
      toast.error("Failed to save configuration");
    } finally {
      setIsLoading(false);
    }
  };

  const currentDomain = form.watch("apiDomain");
  const canTest = currentDomain && currentDomain.startsWith("https://") && !form.formState.errors.apiDomain;

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
                    placeholder="https://bunisystems.wauminisacco.co.ke" 
                    className="pl-10"
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormDescription>
                This will be used as the base URL for all API requests.
                Make sure the API server supports CORS for your domain.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-2">
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
          
          {canTest && (
            <Button
              type="button"
              variant="outline"
              disabled={isTesting}
              onClick={() => testApiConnection(currentDomain)}
              className="gap-2"
            >
              {isTesting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4" />
                  Test Connection
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default ApiDomainForm;
