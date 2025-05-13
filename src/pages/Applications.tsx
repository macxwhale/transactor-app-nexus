
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable } from "@/components/ui/data-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { Application, createApplication, fetchApplications, toggleApplicationStatus, updateApplication } from "@/lib/api";
import { generateMockApplications } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";

const applicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  callback_url: z.string().url("Must be a valid URL starting with https://"),
  consumer_key: z.string().min(1, "Consumer key is required"),
  consumer_secret: z.string().min(1, "Consumer secret is required"),
  business_short_code: z.string().min(1, "Business short code is required"),
  passkey: z.string().min(1, "Passkey is required"),
  bearer_token: z.string().min(1, "Bearer token is required"),
  party_a: z.string().min(1, "Party A is required"),
  party_b: z.string().min(1, "Party B is required"),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

const ApplicationForm = ({
  onSubmit,
  defaultValues,
  isEditing = false,
}: {
  onSubmit: (data: ApplicationFormValues) => void;
  defaultValues?: Partial<ApplicationFormValues>;
  isEditing?: boolean;
}) => {
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: defaultValues || {
      name: "",
      callback_url: "",
      consumer_key: "",
      consumer_secret: "",
      business_short_code: "",
      passkey: "",
      bearer_token: "",
      party_a: "",
      party_b: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>App Name</FormLabel>
                <FormControl>
                  <Input placeholder="My App" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="callback_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Callback URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/callback" {...field} />
                </FormControl>
                <FormDescription>Must start with https://</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="consumer_key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consumer Key</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="consumer_secret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consumer Secret</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="business_short_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Short Code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passkey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passkey</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="bearer_token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bearer Token</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="party_a"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Party A</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="party_b"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Party B</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          {isEditing ? "Update Application" : "Register Application"}
        </Button>
      </form>
    </Form>
  );
};

const Applications = () => {
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

  useEffect(() => {
    fetchApps();
  }, []);

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
    } catch (error) {
      console.error("Failed to register application:", error);
      toast.error("Failed to register application");
    }
  };

  const handleUpdateApplication = async (data: ApplicationFormValues) => {
    if (!editingApp) return;
    
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
    } catch (error) {
      console.error("Failed to update application:", error);
      toast.error("Failed to update application");
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedAppId) return;
    
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
    } catch (error) {
      console.error("Failed to toggle application status:", error);
      toast.error("Failed to toggle application status");
    }
  };

  const openStatusDialog = (id: string, status: boolean) => {
    setSelectedAppId(id);
    setNewStatus(status);
    setIsStatusDialogOpen(true);
  };

  const filteredApplications = applications.filter(
    app => app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      id: "name",
      header: "Name",
      cell: (app: Application) => (
        <div>
          <div className="font-medium">{app.name}</div>
          <div className="text-sm text-muted-foreground">
            {app.callback_url}
          </div>
        </div>
      ),
    },
    {
      id: "business_short_code",
      header: "Business Code",
      cell: (app: Application) => app.business_short_code,
    },
    {
      id: "status",
      header: "Status",
      cell: (app: Application) => (
        <StatusBadge status={app.is_active ? "active" : "inactive"} />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (app: Application) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditingApp(app)}
          >
            Edit
          </Button>
          <Button
            variant={app.is_active ? "destructive" : "outline"}
            size="sm"
            onClick={() => openStatusDialog(app.id, !app.is_active)}
          >
            {app.is_active ? "Deactivate" : "Activate"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={fetchApps}
            disabled={isLoading}
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                New Application
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Register New Application</DialogTitle>
                <DialogDescription>
                  Fill out this form to register a new M-Pesa application.
                </DialogDescription>
              </DialogHeader>
              <ApplicationForm 
                onSubmit={handleCreateApplication} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Applications</CardTitle>
          <CardDescription>
            Manage your M-Pesa applications and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredApplications}
            columns={columns}
            searchPlaceholder="Search applications..."
            onSearch={setSearchTerm}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingApp && (
        <Dialog open={!!editingApp} onOpenChange={(open) => !open && setEditingApp(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Application</DialogTitle>
              <DialogDescription>
                Update the details for {editingApp.name}
              </DialogDescription>
            </DialogHeader>
            <ApplicationForm 
              onSubmit={handleUpdateApplication}
              defaultValues={editingApp}
              isEditing
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Status Toggle Dialog */}
      <AlertDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {newStatus ? "Activate" : "Deactivate"} Application
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {newStatus ? "activate" : "deactivate"} this application?
              {!newStatus && " The application will no longer process any transactions."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleStatus}
              className={newStatus ? "bg-success text-success-foreground hover:bg-success/90" : ""}
            >
              {newStatus ? "Activate" : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Applications;
