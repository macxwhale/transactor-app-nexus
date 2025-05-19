
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
import { Settings, Server, Save, Link } from "lucide-react";

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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Configuration
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure your application settings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="hover-lift">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/80 to-secondary/80" />
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  API Configuration
                </CardTitle>
                <CardDescription>
                  Set up your API domain for all endpoints
                </CardDescription>
              </div>
              <div className="bg-muted/50 text-muted-foreground text-xs px-2 py-1 rounded-md">
                {apiDomain ? 'Connected' : 'Not configured'}
              </div>
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
                </form>
              </Form>
            </CardContent>
            <CardFooter>
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
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card className="hover-lift">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/80 to-secondary/80" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                API Endpoints
              </CardTitle>
              <CardDescription>
                Reference for available API endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
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
      </div>
    </div>
  );
};

export default Configuration;
