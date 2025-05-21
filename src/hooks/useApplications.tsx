
import { useEffect } from "react";
import { fetchApplicationsFromSupabase } from "@/services/applicationSupabaseService";
import { useApplicationState } from "./useApplicationState";
import { useApplicationCreate } from "./useApplicationCreate";
import { useApplicationUpdate } from "./useApplicationUpdate";
import { useApplicationToggle } from "./useApplicationToggle";
import { useApplicationDelete } from "./useApplicationDelete";
import { useApplicationPagination } from "./useApplicationPagination";
import { useApplicationSearch } from "./useApplicationSearch";

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

  // Search functionality
  const { searchTerm, setSearchTerm, filteredApplications } = useApplicationSearch(applications);

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

  // Use pagination hook with filtered applications
  const { 
    currentPage, 
    totalPages, 
    setCurrentPage,
    paginatedApplications,
    totalItems
  } = useApplicationPagination(filteredApplications);
  
  // Combine submission states
  const isSubmitting = isCreateSubmitting || isUpdateSubmitting || isDeleting;

  // Fetch applications on component mount
  useEffect(() => {
    fetchApps();
  }, []);

  return {
    // Return paginated applications for display
    applications: paginatedApplications, 
    allApplicationsCount: applications.length,
    filteredCount: totalItems,
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
    setCurrentPage,
    searchTerm,
    setSearchTerm
  };
}
