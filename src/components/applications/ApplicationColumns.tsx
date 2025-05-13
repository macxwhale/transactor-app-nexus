
import React from "react";
import { Button } from "@/components/ui/button";
import { Application } from "@/lib/api";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface ApplicationColumnProps {
  onEditApplication: (app: Application) => void;
  onToggleStatus: (id: string, status: boolean) => void;
}

export const getApplicationColumns = ({ onEditApplication, onToggleStatus }: ApplicationColumnProps) => [
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
          variant={app.is_active ? "destructive" : "outline"}
          size="sm"
          onClick={() => onToggleStatus(app.id, !app.is_active)}
        >
          {app.is_active ? "Deactivate" : "Activate"}
        </Button>
      </div>
    ),
  },
];
