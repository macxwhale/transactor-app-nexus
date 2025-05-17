
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface StatusDistributionProps {
  stats: {
    completedTransactions: number;
    pendingTransactions: number;
    failedTransactions: number;
    totalTransactions: number;
  };
}

export const StatusDistributionChart = ({ stats }: StatusDistributionProps) => {
  // Colors for the pie chart
  const COLORS = ["#17c964", "#f5a524", "#f31260"];

  // Status data for pie chart
  const statusData = [
    { name: "Completed", value: stats.completedTransactions },
    { name: "Pending", value: stats.pendingTransactions },
    { name: "Failed", value: stats.failedTransactions },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Status</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {stats.totalTransactions > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => [`${value} transactions`]}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No transaction data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
