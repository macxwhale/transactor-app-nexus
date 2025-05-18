
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Plus } from "lucide-react";

interface ApplicationsHeaderProps {
  fetchApps: () => Promise<void>;
  isLoading: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  handleCreateApplication: (data: any) => Promise<void>;
  isSubmitting: boolean;
  totalApplications: number;
}

const ApplicationsHeader: React.FC<ApplicationsHeaderProps> = ({
  fetchApps,
  isLoading,
  totalApplications,
  setIsDialogOpen
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground mt-1">
          Total: {totalApplications} applications
        </p>
      </div>
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
        
        <Button 
          variant="default" 
          size="sm"
          className="gap-1"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Application
        </Button>
      </div>
    </div>
  );
};

export default ApplicationsHeader;
