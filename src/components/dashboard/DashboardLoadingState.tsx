
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const DashboardLoadingState = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="h-36 bg-muted/20 flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
