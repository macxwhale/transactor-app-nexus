
import { useState, useEffect } from "react";
import { Application } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";

export function useApplicationsList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);

  const fetchApplications = async () => {
    console.log("Fetching applications from Supabase...");
    try {
      // Fetch applications from Supabase
      const { data: appsData, error: appsError } = await supabase
        .from('applications')
        .select('id, name, is_active, business_short_code, app_id, app_secret');
      
      if (appsError) {
        console.error("Supabase applications error:", appsError);
        throw appsError;
      }
      
      console.log(`Fetched ${appsData?.length || 0} applications`);
      
      // Convert Supabase applications data to our Application type
      const formattedApps: Application[] = (appsData || []).map(app => ({
        id: app.id,
        name: app.name,
        callback_url: '',
        consumer_key: '',
        consumer_secret: '',
        business_short_code: app.business_short_code,
        passkey: '',
        bearer_token: '',
        party_a: '',
        party_b: '',
        is_active: app.is_active ?? true,
        created_at: '',
        updated_at: '',
        app_id: app.app_id || '',
        app_secret: app.app_secret || '',
        transaction_type: 'CustomerPayBillOnline',
        environment: 'Production'
      }));
      
      setApplications(formattedApps);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      setApplications([]); // Set empty array on error
    } finally {
      setIsLoadingApplications(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return {
    applications,
    isLoadingApplications,
    fetchApplications
  };
}
