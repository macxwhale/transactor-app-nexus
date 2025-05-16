
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type StatusType = 'success' | 'pending' | 'failed' | 'inactive' | 'active' | 'completed' | 'processing';

interface StatusBadgeProps {
  status: StatusType;
  text?: string;
  className?: string;
}

export function StatusBadge({ status, text, className }: StatusBadgeProps) {
  // Map status to configuration
  const statusConfig = {
    success: {
      variant: "success" as const,
      label: text || "Completed",
    },
    completed: {
      variant: "success" as const,
      label: text || "Completed",
    },
    pending: {
      variant: "warning" as const,
      label: text || "Pending",
    },
    processing: {
      variant: "warning" as const,
      label: text || "Processing",
    },
    failed: {
      variant: "destructive" as const,
      label: text || "Failed",
    },
    inactive: {
      variant: "outline" as const,
      label: text || "Inactive",
    },
    active: {
      variant: "success" as const,
      label: text || "Active",
    },
  };

  // Get the configuration for the current status or use a default
  const config = statusConfig[status] || {
    variant: "outline" as const,
    label: text || status,
  };

  // Use the variant from the config or fall back to "default"
  const variant = config.variant as "default" | "secondary" | "destructive" | "outline" | "success" | "warning";

  return (
    <Badge variant={variant} className={cn(className)}>
      {config.label}
    </Badge>
  );
}
