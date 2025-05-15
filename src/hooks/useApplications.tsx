
import { useEffect } from "react";
import { fetchApplicationsFromSupabase } from "@/services/applicationSupabaseService";
import { useApplicationState } from "./useApplicationState";
import { useApplicationCreate } from "./useApplicationCreate";
import { useApplicationUpdate } from "./useApplicationUpdate";

export function useApplications() {
  const {
    applications,
    setApplications,
    isLoading,
    setIsLoading,
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

  // Initialize the dedicated hooks
  const { 
    isDialogOpen, 
    setIsDialogOpen, 
    handleCreateApplication,
    isSubmitting: isCreateSubmitting
  } = useApplicationCreate(fetchApps);
  
  const { 
    editingApp, 
    setEditingApp, 
    handleUpdateApplication,
    isSubmitting: isUpdateSubmitting
  } = useApplicationUpdate(fetchApps);

  // Combine submission states
  const isSubmitting = isCreateSubmitting || isUpdateSubmitting;

  // Fetch applications on component mount
  useEffect(() => {
    fetchApps();
  }, []);

  return {
    applications: filteredApplications,
    isLoading,
    editingApp,
    isDialogOpen,
    searchTerm,
    setSearchTerm,
    setIsDialogOpen,
    setEditingApp,
    fetchApps,
    handleCreateApplication,
    handleUpdateApplication,
    isSubmitting
  };
}
