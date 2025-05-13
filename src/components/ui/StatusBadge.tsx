
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type StatusType = 'success' | 'pending' | 'failed' | 'inactive' | 'active';

interface StatusBadgeProps {
  status: StatusType;
  text?: string;
  className?: string;
}

export function StatusBadge({ status, text, className }: StatusBadgeProps) {
  const statusConfig = {
    success: {
      variant: "success",
      label: text || "Completed",
    },
    pending: {
      variant: "warning",
      label: text || "Pending",
    },
    failed: {
      variant: "destructive",
      label: text || "Failed",
    },
    inactive: {
      variant: "outline",
      label: text || "Inactive",
    },
    active: {
      variant: "success",
      label: text || "Active",
    },
  }[status];

  const variant = statusConfig.variant as "default" | "secondary" | "destructive" | "outline" | "success" | "warning";

  return (
    <Badge variant={variant} className={cn(className)}>
      {statusConfig.label}
    </Badge>
  );
}
