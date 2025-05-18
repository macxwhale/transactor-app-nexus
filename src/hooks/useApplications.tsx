
import { useEffect } from "react";
import { fetchApplicationsFromSupabase } from "@/services/applicationSupabaseService";
import { useApplicationState } from "./useApplicationState";
import { useApplicationCreate } from "./useApplicationCreate";
import { useApplicationUpdate } from "./useApplicationUpdate";
import { useApplicationToggle } from "./useApplicationToggle";
import { useApplicationDelete } from "./useApplicationDelete";
import { useApplicationPagination } from "./useApplicationPagination";

export function useApplications() {
  // Initialize the state hook
  const {
    applications,
    setApplications,
    isLoading,
    setIsLoading
  } = useApplicationState();

  // Fetch applications function
  const fetchApps = async () => {
    setIsLoading(true);
    try {
      const apps = await fetchApplicationsFromSupabase();
      setApplications(apps);
    } finally {
      setIsLoading(false);
    }
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

  // Use pagination hook with all applications (not pre-paginated data)
  const { 
    currentPage, 
    totalPages, 
    setCurrentPage,
    paginatedApplications,
    totalItems
  } = useApplicationPagination(applications);
  
  // Combine submission states
  const isSubmitting = isCreateSubmitting || isUpdateSubmitting || isDeleting;

  // Fetch applications on component mount
  useEffect(() => {
    fetchApps();
  }, []);

  return {
    // Return paginated applications for display
    applications: paginatedApplications, 
    allApplicationsCount: totalItems,
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
