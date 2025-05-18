
import { useState } from "react";
import { Application } from "@/lib/api";

export function useApplicationState() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // For pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // No longer filter applications
  const filteredApplications = applications;

  return {
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
    currentPage,
    setCurrentPage,
    totalPages,
    setTotalPages,
    filteredApplications
  };
}
