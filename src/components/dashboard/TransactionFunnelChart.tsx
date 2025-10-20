import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowDown } from "lucide-react";

interface FunnelStage {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface TransactionFunnelChartProps {
  stages: FunnelStage[];
}

export const TransactionFunnelChart = ({ stages }: TransactionFunnelChartProps) => {
  const maxCount = stages[0]?.count || 1;

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Transaction Flow</CardTitle>
        <CardDescription className="mt-1">
          Conversion funnel from initiation to completion
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {stages.map((stage, index) => {
          const width = (stage.count / maxCount) * 100;
          const dropoff = index > 0 ? stages[index - 1].count - stage.count : 0;
          const dropoffRate = index > 0 ? ((dropoff / stages[index - 1].count) * 100).toFixed(1) : 0;

          return (
            <div key={stage.name} className="space-y-1">
              {index > 0 && (
                <div className="flex items-center justify-center py-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ArrowDown className="h-3 w-3" />
                    <span>{dropoffRate}% drop-off ({dropoff.toLocaleString()})</span>
                  </div>
                </div>
              )}
              <div className="relative">
                <div 
                  className="h-16 rounded-lg flex items-center justify-between px-4 transition-all duration-300 hover:scale-[1.02]"
                  style={{ 
                    width: `${width}%`,
                    backgroundColor: stage.color,
                    minWidth: '200px'
                  }}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                      {stage.name}
                    </span>
                    <span className="text-xs text-white/80">
                      {stage.percentage.toFixed(1)}% of total
                    </span>
                  </div>
                  <span className="text-lg font-bold text-white">
                    {stage.count.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
