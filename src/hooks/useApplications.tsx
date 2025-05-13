
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
      // Use Supabase to fetch real applications data
      const { data: appsData, error } = await supabase
        .from('applications')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      // Convert Supabase applications data to our Application type
      const formattedApps: Application[] = appsData.map(app => ({
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
      
      setApplications(formattedApps);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      toast.error("Failed to fetch applications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateApplication = async (data: ApplicationFormValues) => {
    try {
      // Get the API domain from localStorage - this comes from Configuration page
      const apiDomain = localStorage.getItem("apiDomain");
      
      if (!apiDomain) {
        toast.error("API domain not configured. Please set it in Configuration.");
        return false;
      }
      
      // Set the API domain for the request
      apiClient.setBaseUrl(apiDomain);
      
      // Call the external API endpoint for registration
      const newApp = await createApplication(data);
      
      // After successful registration, update the local list
      setApplications([...applications, newApp]);
      setIsDialogOpen(false);
      toast.success("Application registered successfully");
      
      // Refresh the list from the database to ensure all fields are present
      fetchApps();
      
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
      // Get the API domain from localStorage
      const apiDomain = localStorage.getItem("apiDomain");
      
      if (!apiDomain) {
        toast.error("API domain not configured. Please set it in Configuration.");
        return false;
      }
      
      // Set the API domain for the request
      apiClient.setBaseUrl(apiDomain);
      
      // Call the external API endpoint for updating
      const updatedApp = await updateApplication(editingApp.id, data);
      
      // Update the local list
      setApplications(applications.map(app => 
        app.id === editingApp.id ? updatedApp : app
      ));
      
      setEditingApp(null);
      toast.success("Application updated successfully");
      
      // Refresh from database to ensure all fields are present
      fetchApps();
      
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
      // Get the API domain from localStorage
      const apiDomain = localStorage.getItem("apiDomain");
      
      if (!apiDomain) {
        toast.error("API domain not configured. Please set it in Configuration.");
        return false;
      }
      
      // Set the API domain for the request
      apiClient.setBaseUrl(apiDomain);
      
      // Call the external API endpoint for status toggle
      const updatedApp = await toggleApplicationStatus(selectedAppId, newStatus);
      
      // Update the local list
      setApplications(applications.map(app => 
        app.id === selectedAppId ? updatedApp : app
      ));
      
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
