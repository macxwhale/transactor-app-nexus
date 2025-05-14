
import { supabase } from "@/integrations/supabase/client";
import { Application } from "@/lib/api";
import { ApplicationFormValues } from "@/components/applications/ApplicationForm";
import { toast } from "sonner";

export async function fetchApplicationsFromSupabase(): Promise<Application[]> {
  try {
    console.log("Fetching applications from Supabase...");
    const { data, error } = await supabase
      .from('applications')
      .select('*');
    
    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }
    
    console.log("Received data from Supabase:", data);
    
    if (!data || data.length === 0) {
      console.log("No applications found in Supabase");
      return [];
    }
    
    // Convert Supabase applications data to our Application type
    const formattedApps: Application[] = data.map(app => ({
      id: app.id,
      name: app.name,
      callback_url: app.callback_url || '',
      consumer_key: app.consumer_key,
      consumer_secret: app.consumer_secret,
      business_short_code: app.business_short_code,
      passkey: app.passkey,
      bearer_token: app.bearer_token || '',
      party_a: app.party_a,
      party_b: app.party_b,
      is_active: app.is_active ?? true,
      created_at: app.created_at || new Date().toISOString(),
      updated_at: app.updated_at || new Date().toISOString(),
      app_id: app.app_id || '',
      app_secret: app.app_secret || ''
    }));
    
    console.log("Formatted applications:", formattedApps);
    return formattedApps;
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    toast.error("Failed to fetch applications");
    return [];
  }
}

// Check if an application with the given name already exists
export async function checkApplicationExists(name: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('id')
      .eq('name', name)
      .maybeSingle();
    
    if (error) {
      console.error("Error checking for existing application:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Failed to check for existing application:", error);
    return false;
  }
}
