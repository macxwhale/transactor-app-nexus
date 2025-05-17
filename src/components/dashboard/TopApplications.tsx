
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface TopApplicationsProps {
  topApplications: Array<{ name: string; transactions: number; amount: number }>;
}

export const TopApplications = ({ topApplications }: TopApplicationsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Applications</CardTitle>
      </CardHeader>
      <CardContent>
        {topApplications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {topApplications.map((app, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="text-sm font-medium">{app.name}</div>
                  <div className="mt-1 text-2xl font-bold">{app.transactions}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {formatCurrency(app.amount)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No application data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
