
import { useEffect } from "react";
import { toast } from "sonner";
import { ApplicationFormValues } from "@/components/applications/ApplicationForm";
import { 
  fetchApplicationsFromSupabase,
  saveApplicationToSupabase,
  updateApplicationInSupabase,
  updateApplicationStatusInSupabase
} from "@/services/applicationSupabaseService";
import {
  registerAppWithAPI,
  registerAppWithEdgeFunction,
  updateAppWithAPI,
  updateAppWithEdgeFunction,
  toggleStatusWithAPI,
  toggleStatusWithEdgeFunction
} from "@/services/applicationApiService";
import { useApplicationState } from "./useApplicationState";

export function useApplications() {
  const {
    applications,
    setApplications,
    isLoading,
    setIsLoading,
    editingApp,
    setEditingApp,
    isStatusDialogOpen,
    setIsStatusDialogOpen,
    selectedAppId,
    setSelectedAppId,
    newStatus,
    setNewStatus,
    isDialogOpen,
    setIsDialogOpen,
    searchTerm,
    setSearchTerm,
    filteredApplications
  } = useApplicationState();

  const fetchApps = async () => {
    setIsLoading(true);
    const apps = await fetchApplicationsFromSupabase();
    setApplications(apps);
    setIsLoading(false);
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
        // If either API or Edge Function was successful, save to Supabase
        const success = await saveApplicationToSupabase(registrationResult.apiResponse, data);
        if (!success) {
          return false;
        }
      } else {
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
      const supabaseSuccess = await updateApplicationInSupabase(editingApp.id, data);
      if (!supabaseSuccess) {
        return false;
      }

      // Additionally, try to update with the API if apiDomain is configured
      const apiDomain = localStorage.getItem("apiDomain");
      if (apiDomain) {
        // Try API update first
        const apiResult = await updateAppWithAPI(editingApp.id, data);
        
        // If API update fails, try Edge Function as fallback
        if (!apiResult.success) {
          await updateAppWithEdgeFunction(editingApp.id, data);
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
      const supabaseSuccess = await updateApplicationStatusInSupabase(selectedAppId, newStatus);
      if (!supabaseSuccess) {
        return false;
      }

      // Additionally, try to update status with the API if apiDomain is configured
      const apiDomain = localStorage.getItem("apiDomain");
      if (apiDomain) {
        // Try API update first
        const apiResult = await toggleStatusWithAPI(selectedAppId, newStatus);
        
        // If API update fails, try Edge Function as fallback
        if (!apiResult.success) {
          await toggleStatusWithEdgeFunction(selectedAppId, newStatus);
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
