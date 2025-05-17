
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface ChartProps {
  dailyStats: Array<{ date: string; count: number; amount: number }>;
}

export const DailyTransactionsChart = ({ dailyStats }: ChartProps) => {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Daily Transactions</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailyStats}>
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                });
              }}
            />
            <YAxis />
            <Tooltip 
              formatter={(value: any) => [`${value} transactions`]}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                });
              }}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Bar 
              dataKey="count" 
              name="Transactions"
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
