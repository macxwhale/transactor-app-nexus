
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

  // In a real application, load this from a settings API or local storage
  const savedDomain = localStorage.getItem("apiDomain") || "";

  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      apiDomain: savedDomain,
    },
  });

  useEffect(() => {
    // Set the API domain in the client when component mounts
    if (savedDomain) {
      apiClient.setBaseUrl(savedDomain);
    }
  }, [savedDomain]);

  const onSubmit = async (data: ConfigFormValues) => {
    setIsLoading(true);
    try {
      // Save to localStorage for demo purposes
      // In a real app, you would save this to a database
      localStorage.setItem("apiDomain", data.apiDomain);
      
      // Update the API client's base URL
      apiClient.setBaseUrl(data.apiDomain);
      
      toast.success("API configuration updated successfully");
      
      // In a real application, you might want to validate the API domain
      // by making a test request
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
              <h3 className="text-lg font-medium">App Registration</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Register a new application
              </p>
              <div className="bg-muted p-3 rounded-md font-mono text-sm">
                POST /register
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Update Application</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Update an existing application
              </p>
              <div className="bg-muted p-3 rounded-md font-mono text-sm">
                PUT /applications/:id
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Toggle Application Status</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Activate or deactivate an application
              </p>
              <div className="bg-muted p-3 rounded-md font-mono text-sm">
                PUT /applications/:id/toggle-status
              </div>
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
