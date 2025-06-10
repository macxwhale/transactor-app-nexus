
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { apiClient } from "@/lib/api";

export const useApiDomain = () => {
  const [apiDomain, setApiDomain] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadApiConfig() {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Loading API configuration from database...");
        const { data, error } = await supabase
          .from('api_configurations')
          .select('value')
          .eq('key', 'apiDomain')
          .single();

        if (error) {
          console.error("Error loading API configuration:", error);
          setError(error);
          return;
        }
        
        if (data?.value) {
          const savedDomain = data.value;
          console.log("API domain loaded from database:", savedDomain);
          setApiDomain(savedDomain);
          
          // Initialize the API client with the domain
          apiClient.setBaseUrl(savedDomain);
        } else {
          console.log("No API domain found in database");
          setApiDomain("");
        }
      } catch (error) {
        console.error("Failed to load API configuration:", error);
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }
    
    loadApiConfig();
  }, []);

  const updateApiDomain = async (domain: string) => {
    console.log("Updating API domain:", domain);
    setApiDomain(domain);
    
    // Update the API client immediately
    apiClient.setBaseUrl(domain);
  };

  return {
    apiDomain,
    setApiDomain: updateApiDomain,
    isLoading,
    error,
    isConfigured: !!apiDomain
  };
};

export default useApiDomain;
