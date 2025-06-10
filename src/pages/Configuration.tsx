
import React from "react";
import ApiConfigurationCard from "@/components/configuration/ApiConfigurationCard";
import ApiEndpointsReference from "@/components/configuration/ApiEndpointsReference";
import useApiDomain from "@/hooks/useApiDomain";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

const Configuration = () => {
  const { apiDomain, setApiDomain, isLoading, error, isConfigured } = useApiDomain();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Configuration
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure your application settings and API endpoints
        </p>
      </div>

      {/* Status Alert */}
      {isLoading ? (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            Loading API configuration...
          </AlertDescription>
        </Alert>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load API configuration: {error.message}
          </AlertDescription>
        </Alert>
      ) : isConfigured ? (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            API is configured and ready to use. Domain: {apiDomain}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            API domain not configured. Please configure it below to enable transaction queries and other API features.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ApiConfigurationCard 
            apiDomain={apiDomain}
            onDomainChange={setApiDomain}
          />
        </div>
        
        <div>
          <ApiEndpointsReference />
        </div>
      </div>
    </div>
  );
};

export default Configuration;
