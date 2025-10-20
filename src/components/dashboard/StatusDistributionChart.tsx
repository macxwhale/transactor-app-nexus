
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StatusDistributionProps {
  stats: {
    completedTransactions: number;
    pendingTransactions: number;
    failedTransactions: number;
    totalTransactions: number;
  };
}

export const StatusDistributionChart = ({ stats }: StatusDistributionProps) => {
  const navigate = useNavigate();
  // Status data for pie chart
  const statusData = [
    { 
      name: "Completed", 
      value: stats.completedTransactions,
      color: "hsl(var(--success))",
      icon: CheckCircle,
      percentage: ((stats.completedTransactions / stats.totalTransactions) * 100).toFixed(1)
    },
    { 
      name: "Pending", 
      value: stats.pendingTransactions,
      color: "hsl(var(--warning))",
      icon: Clock,
      percentage: ((stats.pendingTransactions / stats.totalTransactions) * 100).toFixed(1)
    },
    { 
      name: "Failed", 
      value: stats.failedTransactions,
      color: "hsl(var(--destructive))",
      icon: XCircle,
      percentage: ((stats.failedTransactions / stats.totalTransactions) * 100).toFixed(1)
    },
  ];

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Status Distribution</CardTitle>
        <CardDescription className="mt-1">
          Transaction outcomes breakdown
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[320px]">
        {stats.totalTransactions > 0 ? (
          <div className="h-full flex flex-col">
            <ResponsiveContainer width="100%" height="70%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                  onClick={(data: any) => {
                    if (data && data.name) {
                      navigate(`/transactions?status=${data.name.toLowerCase()}`);
                    }
                  }}
                  cursor="pointer"
                >
                  {statusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke={entry.color}
                      strokeWidth={0}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-card p-3 shadow-lg">
                        <p className="text-sm font-medium mb-1">{data.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {data.value.toLocaleString()} transactions ({data.percentage}%)
                        </p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend with icons - now clickable */}
            <div className="grid grid-cols-1 gap-2 mt-2">
              {statusData.map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(`/transactions?status=${item.name.toLowerCase()}`)}
                  className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors cursor-pointer w-full"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-medium">{item.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    {item.percentage}%
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">No transaction data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
