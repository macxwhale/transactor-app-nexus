
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Application, apiClient, createApplication, updateApplication, toggleApplicationStatus } from "@/lib/api";
import { toast } from "sonner";
import { ApplicationFormValues } from "@/components/applications/ApplicationForm";

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchApps = async () => {
    setIsLoading(true);
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
        setApplications([]);
        setIsLoading(false);
        return;
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
        updated_at: app.updated_at || new Date().toISOString()
      }));
      
      console.log("Formatted applications:", formattedApps);
      setApplications(formattedApps);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      toast.error("Failed to fetch applications");
    } finally {
      setIsLoading(false);
    }
  };

  const registerAppWithAPI = async (data: ApplicationFormValues): Promise<{ success: boolean; apiResponse?: any }> => {
    const apiDomain = localStorage.getItem("apiDomain");
    if (!apiDomain) {
      console.log("No API domain configured");
      return { success: false };
    }

    try {
      console.log("API domain found, attempting to register with API first");
      apiClient.setBaseUrl(apiDomain);
      const apiResponse = await createApplication(data);
      console.log("API registration response:", apiResponse);
      return { success: true, apiResponse };
    } catch (error) {
      console.error("API registration failed:", error);
      return { success: false };
    }
  };

  const registerAppWithEdgeFunction = async (data: ApplicationFormValues): Promise<{ success: boolean; apiResponse?: any }> => {
    try {
      console.log("Attempting to register with Edge Function");
      const response = await fetch('https://yviivxtgzmethbbtzwbv.supabase.co/functions/v1/register-app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Edge Function error:", errorData);
        return { success: false };
      }

      const apiResponse = await response.json();
      console.log("Edge Function registration response:", apiResponse);
      return { success: true, apiResponse: apiResponse.data };
    } catch (error) {
      console.error("Edge Function registration failed:", error);
      return { success: false };
    }
  };

  const handleCreateApplication = async (data: ApplicationFormValues) => {
    try {
      console.log("Creating application with data:", data);
      
      // Try API registration first
      let registrationResult = await registerAppWithAPI(data);
      
      // If API registration fails, try Edge Function
      if (!registrationResult.success) {
        console.log("Direct API registration failed, trying Edge Function");
        registrationResult = await registerAppWithEdgeFunction(data);
      }
      
      if (registrationResult.success && registrationResult.apiResponse) {
        // If either API or Edge Function was successful
        const apiResponse = registrationResult.apiResponse;
        
        // Insert the application into Supabase using the app_id and app_secret from the API
        const { error: supabaseError } = await supabase.from('applications').insert([{
          name: data.name,
          callback_url: data.callback_url,
          consumer_key: data.consumer_key,
          consumer_secret: data.consumer_secret,
          business_short_code: data.business_short_code,
          passkey: data.passkey,
          bearer_token: data.bearer_token,
          party_a: data.party_a,
          party_b: data.party_b,
          app_id: apiResponse.app_id || apiResponse.id || data.consumer_key,
          app_secret: apiResponse.app_secret || data.consumer_secret,
          is_active: true
        }]);
        
        if (supabaseError) {
          console.error("Supabase insert error after API registration:", supabaseError);
          toast.error(`Failed to register application in database: ${supabaseError.message}`);
          return false;
        }
      } else {
        // No need to insert directly as we always try to use either API or Edge Function
        toast.error("Failed to register application with both direct API and Edge Function");
        return false;
      }
      
      // Refresh the applications list
      await fetchApps();
      
      setIsDialogOpen(false);
      toast.success("Application registered successfully");
      return true;
    } catch (error) {
      console.error("Failed to register application:", error);
      toast.error("Failed to register application");
      return false;
    }
  };

  const handleUpdateApplication = async (data: ApplicationFormValues) => {
    if (!editingApp) return false;
    
    try {
      // Update the application in Supabase directly
      const { error: supabaseError } = await supabase
        .from('applications')
        .update({
          name: data.name,
          callback_url: data.callback_url,
          consumer_key: data.consumer_key,
          consumer_secret: data.consumer_secret,
          business_short_code: data.business_short_code,
          passkey: data.passkey,
          bearer_token: data.bearer_token,
          party_a: data.party_a,
          party_b: data.party_b,
        })
        .eq('id', editingApp.id);
      
      if (supabaseError) {
        console.error("Supabase update error:", supabaseError);
        toast.error(`Failed to update application in database: ${supabaseError.message}`);
        return false;
      }

      // Additionally, try to update with the API if apiDomain is configured
      const apiDomain = localStorage.getItem("apiDomain");
      if (apiDomain) {
        try {
          apiClient.setBaseUrl(apiDomain);
          await updateApplication(editingApp.id, data);
          toast.success("Application updated successfully with API");
        } catch (apiError) {
          console.warn("API update failed, but database update succeeded:", apiError);
          // Try Edge Function as fallback
          try {
            const response = await fetch('https://yviivxtgzmethbbtzwbv.supabase.co/functions/v1/register-app', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: editingApp.id, ...data })
            });
            
            if (response.ok) {
              console.log("Edge Function update succeeded");
            } else {
              console.warn("Edge Function update failed");
            }
          } catch (edgeError) {
            console.warn("Edge Function update failed:", edgeError);
          }
        }
      }
      
      // Refresh the applications list
      await fetchApps();
      
      setEditingApp(null);
      toast.success("Application updated successfully");
      return true;
    } catch (error) {
      console.error("Failed to update application:", error);
      toast.error("Failed to update application");
      return false;
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedAppId) return false;
    
    try {
      // Update the status in Supabase directly
      const { error: supabaseError } = await supabase
        .from('applications')
        .update({ is_active: newStatus })
        .eq('id', selectedAppId);
      
      if (supabaseError) {
        console.error("Supabase status update error:", supabaseError);
        toast.error(`Failed to update application status in database: ${supabaseError.message}`);
        return false;
      }

      // Additionally, try to update status with the API if apiDomain is configured
      const apiDomain = localStorage.getItem("apiDomain");
      if (apiDomain) {
        try {
          apiClient.setBaseUrl(apiDomain);
          await toggleApplicationStatus(selectedAppId, newStatus);
          toast.success(`Application ${newStatus ? 'activated' : 'deactivated'} successfully with API`);
        } catch (apiError) {
          console.warn("API status update failed, but database update succeeded:", apiError);
          // Try Edge Function as fallback
          try {
            const response = await fetch('https://yviivxtgzmethbbtzwbv.supabase.co/functions/v1/register-app', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: selectedAppId, is_active: newStatus })
            });
            
            if (response.ok) {
              console.log("Edge Function status update succeeded");
            } else {
              console.warn("Edge Function status update failed");
            }
          } catch (edgeError) {
            console.warn("Edge Function status update failed:", edgeError);
          }
        }
      }
      
      // Refresh the applications list
      await fetchApps();
      
      setIsStatusDialogOpen(false);
      toast.success(`Application ${newStatus ? 'activated' : 'deactivated'} successfully`);
      return true;
    } catch (error) {
      console.error("Failed to toggle application status:", error);
      toast.error("Failed to toggle application status");
      return false;
    }
  };

  const openStatusDialog = (id: string, status: boolean) => {
    setSelectedAppId(id);
    setNewStatus(status);
    setIsStatusDialogOpen(true);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const filteredApplications = applications.filter(
    app => app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    applications: filteredApplications,
    isLoading,
    editingApp,
    isStatusDialogOpen,
    selectedAppId,
    newStatus,
    isDialogOpen,
    searchTerm,
    setSearchTerm,
    setIsDialogOpen,
    setEditingApp,
    setIsStatusDialogOpen,
    fetchApps,
    handleCreateApplication,
    handleUpdateApplication,
    handleToggleStatus,
    openStatusDialog
  };
}
