
import React from "react";
import ApiConfigurationCard from "@/components/configuration/ApiConfigurationCard";
import ApiEndpointsReference from "@/components/configuration/ApiEndpointsReference";
import useApiDomain from "@/hooks/useApiDomain";

const Configuration = () => {
  const { apiDomain, setApiDomain, isLoading } = useApiDomain();

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
