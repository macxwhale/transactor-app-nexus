
import React from "react";
import { Button } from "@/components/ui/button";
import { Application } from "@/lib/api";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Trash2, Power } from "lucide-react";

interface ApplicationColumnProps {
  onEditApplication: (app: Application) => void;
  onDeleteApplication: (app: Application) => void;
  onToggleStatus: (app: Application) => void;
}

export const getApplicationColumns = ({ 
  onEditApplication, 
  onDeleteApplication,
  onToggleStatus
}: ApplicationColumnProps) => [
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
          onClick={() => onEditApplication(app)}
        >
          Edit
        </Button>
        <Button
          variant={app.is_active ? "outline" : "outline"}
          size="sm"
          className={app.is_active ? "text-red-500 hover:bg-red-50" : "text-green-500 hover:bg-green-50"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus(app);
          }}
        >
          <Power className="h-4 w-4" />
          {app.is_active ? "Deactivate" : "Activate"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteApplication(app);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
