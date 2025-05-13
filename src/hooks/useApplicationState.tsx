
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
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApplications = applications.filter(
    app => app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    searchTerm,
    setSearchTerm,
    filteredApplications
  };
}
