
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
      try {
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
        
        if (data) {
          const savedDomain = data.value;
          setApiDomain(savedDomain);
          
          // Set the API domain in the client
          if (savedDomain) {
            apiClient.setBaseUrl(savedDomain);
          }
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

  const updateApiDomain = (domain: string) => {
    setApiDomain(domain);
  };

  return {
    apiDomain,
    setApiDomain: updateApiDomain,
    isLoading,
    error
  };
};

export default useApiDomain;
