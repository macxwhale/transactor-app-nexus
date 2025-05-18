
import { useEffect } from "react";
import { fetchApplicationsFromSupabase } from "@/services/applicationSupabaseService";
import { useApplicationState } from "./useApplicationState";
import { useApplicationCreate } from "./useApplicationCreate";
import { useApplicationUpdate } from "./useApplicationUpdate";
import { useApplicationToggle } from "./useApplicationToggle";
import { useApplicationDelete } from "./useApplicationDelete";
import { useApplicationPagination } from "./useApplicationPagination";

export function useApplications() {
  const {
    applications,
    setApplications,
    isLoading,
    setIsLoading
  } = useApplicationState();

  // Fetch applications function
  const fetchApps = async () => {
    setIsLoading(true);
    const apps = await fetchApplicationsFromSupabase();
    setApplications(apps);
    setIsLoading(false);
  };

  // Initialize the specialized hooks
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

  const {
    isStatusDialogOpen,
    setIsStatusDialogOpen,
    newStatus,
    handleToggleStatus,
    openStatusDialog
  } = useApplicationToggle(fetchApps);

  const {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    applicationToDelete,
    openDeleteDialog,
    handleDeleteApplication,
    isDeleting
  } = useApplicationDelete(fetchApps);

  // Use pagination hook
  const { 
    currentPage, 
    totalPages, 
    setCurrentPage,
    paginatedApplications 
  } = useApplicationPagination(applications);
  
  // Combine submission states
  const isSubmitting = isCreateSubmitting || isUpdateSubmitting || isDeleting;

  // Fetch applications on component mount
  useEffect(() => {
    fetchApps();
  }, []);

  return {
    applications: paginatedApplications,
    isLoading,
    editingApp,
    isDialogOpen,
    setIsDialogOpen,
    setEditingApp,
    fetchApps,
    handleCreateApplication,
    handleUpdateApplication,
    handleDeleteApplication,
    isSubmitting,
    isStatusDialogOpen,
    setIsStatusDialogOpen,
    newStatus,
    handleToggleStatus,
    openStatusDialog,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    applicationToDelete,
    openDeleteDialog,
    currentPage,
    totalPages,
    setCurrentPage
  };
}
