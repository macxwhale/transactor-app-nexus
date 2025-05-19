
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
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
import { supabase } from "@/integrations/supabase/client";

const configSchema = z.object({
  apiDomain: z
    .string()
    .url("Must be a valid URL")
    .refine((val) => val.startsWith("https://"), {
      message: "API domain must use HTTPS",
    }),
});

type ConfigFormValues = z.infer<typeof configSchema>;

const Configuration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiDomain, setApiDomain] = useState("");

  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      apiDomain: "",
    },
  });
  
  // Load the API domain from the database on component mount
  useEffect(() => {
    async function loadApiConfig() {
      try {
        const { data, error } = await supabase
          .from('api_configurations')
          .select('value')
          .eq('key', 'apiDomain')
          .single();

        if (error) {
          console.error("Error loading API configuration:", error);
          return;
        }
        
        if (data) {
          // Set the form value with the loaded API domain
          const savedDomain = data.value;
          form.setValue('apiDomain', savedDomain);
          setApiDomain(savedDomain);
          
          // Set the API domain in the client
          if (savedDomain) {
            apiClient.setBaseUrl(savedDomain);
          }
        }
      } catch (error) {
        console.error("Failed to load API configuration:", error);
      }
    }
    
    loadApiConfig();
  }, [form]);

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
      
      // Update the local state
      setApiDomain(data.apiDomain);
      
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuration</h1>
        <p className="text-muted-foreground mt-2">
          Configure your application settings
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            Set up your API domain for all endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} id="config-form" className="space-y-4">
              <FormField
                control={form.control}
                name="apiDomain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Domain</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      This will be used as the base URL for all API requests.
                      Example: https://bunisystems.wauminisacco.co.ke
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            form="config-form"
            disabled={isLoading || !form.formState.isDirty}
          >
            {isLoading ? "Saving..." : "Save Configuration"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>API Endpoints</CardTitle>
          <CardDescription>
            Reference for available API endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Login</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Authenticate with the API using an app ID
              </p>
              <div className="bg-muted p-3 rounded-md font-mono text-sm">
                POST /login
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Transaction Query</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Query transaction status by checkout request ID
              </p>
              <div className="bg-muted p-3 rounded-md font-mono text-sm">
                POST /express/query
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Headers required: App-ID
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Get Transactions</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Retrieve transaction data with optional filters
              </p>
              <div className="bg-muted p-3 rounded-md font-mono text-sm">
                GET /transactions
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Dashboard Stats</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Get dashboard statistics and metrics
              </p>
              <div className="bg-muted p-3 rounded-md font-mono text-sm">
                GET /stats/dashboard
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Configuration;
