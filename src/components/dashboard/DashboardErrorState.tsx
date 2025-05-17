
import React from "react";
import { Button } from "@/components/ui/button";

interface DashboardErrorStateProps {
  onRetry: () => void;
}

export const DashboardErrorState = ({ onRetry }: DashboardErrorStateProps) => {
  return (
    <div className="p-12 text-center">
      <p className="text-muted-foreground">Could not load dashboard data</p>
      <Button onClick={onRetry} className="mt-4">
        Try Again
      </Button>
    </div>
  );
};
