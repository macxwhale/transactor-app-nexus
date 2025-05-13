
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Application } from "@/lib/api";
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
      // Fallback to mock data if there's an error
      const mockData = generateMockApplications();
      setApplications(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateApplication = async (data: ApplicationFormValues) => {
    try {
      // Insert new application into Supabase
      const { data: createdApp, error } = await supabase
        .from('applications')
        .insert([
          {
            name: data.name,
            callback_url: data.callback_url,
            consumer_key: data.consumer_key,
            consumer_secret: data.consumer_secret,
            business_short_code: data.business_short_code,
            passkey: data.passkey,
            bearer_token: data.bearer_token,
            party_a: data.party_a,
            party_b: data.party_b,
            is_active: true,
            app_id: Math.random().toString(36).substring(2, 15),
            app_secret: Math.random().toString(36).substring(2, 15)
          }
        ])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Format the created app to match our Application type
      const newApp: Application = {
        id: createdApp.id,
        name: createdApp.name,
        callback_url: createdApp.callback_url || '',
        consumer_key: createdApp.consumer_key,
        consumer_secret: createdApp.consumer_secret,
        business_short_code: createdApp.business_short_code,
        passkey: createdApp.passkey,
        bearer_token: createdApp.bearer_token || '',
        party_a: createdApp.party_a,
        party_b: createdApp.party_b,
        is_active: createdApp.is_active ?? true,
        created_at: createdApp.created_at || new Date().toISOString(),
        updated_at: createdApp.updated_at || new Date().toISOString()
      };
      
      setApplications([...applications, newApp]);
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
      // Update application in Supabase
      const { data: updatedApp, error } = await supabase
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
          updated_at: new Date().toISOString()
        })
        .eq('id', editingApp.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Format the updated app to match our Application type
      const formattedApp: Application = {
        id: updatedApp.id,
        name: updatedApp.name,
        callback_url: updatedApp.callback_url || '',
        consumer_key: updatedApp.consumer_key,
        consumer_secret: updatedApp.consumer_secret,
        business_short_code: updatedApp.business_short_code,
        passkey: updatedApp.passkey,
        bearer_token: updatedApp.bearer_token || '',
        party_a: updatedApp.party_a,
        party_b: updatedApp.party_b,
        is_active: updatedApp.is_active ?? true,
        created_at: updatedApp.created_at || new Date().toISOString(),
        updated_at: updatedApp.updated_at || new Date().toISOString()
      };
      
      setApplications(applications.map(app => 
        app.id === editingApp.id ? formattedApp : app
      ));
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
      // Update application status in Supabase
      const { error } = await supabase
        .from('applications')
        .update({
          is_active: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedAppId);
      
      if (error) {
        throw error;
      }
      
      setApplications(applications.map(app => 
        app.id === selectedAppId 
          ? { ...app, is_active: newStatus, updated_at: new Date().toISOString() } 
          : app
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

  // Function to generate mock applications if needed
  const generateMockApplications = (): Application[] => {
    return Array(5)
      .fill(null)
      .map((_, index) => ({
        id: `mock-${index + 1}`,
        name: `Mock App ${index + 1}`,
        callback_url: `https://example.com/callback/${index + 1}`,
        consumer_key: `consumer_key_${index + 1}`,
        consumer_secret: `consumer_secret_${index + 1}`,
        business_short_code: `${100000 + index}`,
        passkey: `passkey_${index + 1}`,
        bearer_token: `bearer_token_${index + 1}`,
        party_a: `party_a_${index + 1}`,
        party_b: `party_b_${index + 1}`,
        is_active: index % 2 === 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
  };

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
