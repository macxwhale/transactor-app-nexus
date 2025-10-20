import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface HeatmapData {
  hour: number;
  day: string;
  value: number;
}

interface HeatmapChartProps {
  data: HeatmapData[];
}

export const HeatmapChart = ({ data }: HeatmapChartProps) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  const getIntensity = (value: number) => {
    const normalized = value / maxValue;
    if (normalized === 0) return 'hsl(var(--muted))';
    if (normalized < 0.2) return 'hsl(var(--primary) / 0.2)';
    if (normalized < 0.4) return 'hsl(var(--primary) / 0.4)';
    if (normalized < 0.6) return 'hsl(var(--primary) / 0.6)';
    if (normalized < 0.8) return 'hsl(var(--primary) / 0.8)';
    return 'hsl(var(--primary))';
  };

  const getValue = (hour: number, day: string) => {
    const item = data.find(d => d.hour === hour && d.day === day);
    return item?.value || 0;
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return '12a';
    if (hour < 12) return `${hour}a`;
    if (hour === 12) return '12p';
    return `${hour - 12}p`;
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Activity Heatmap</CardTitle>
        <CardDescription className="mt-1">
          Transaction volume by day and hour
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Hour labels */}
            <div className="flex mb-1">
              <div className="w-12"></div>
              {hours.filter(h => h % 3 === 0).map(hour => (
                <div key={hour} className="w-8 text-[10px] text-muted-foreground text-center">
                  {formatHour(hour)}
                </div>
              ))}
            </div>
            
            {/* Heatmap grid */}
            {days.map(day => (
              <div key={day} className="flex items-center mb-1">
                <div className="w-12 text-xs text-muted-foreground font-medium pr-2">
                  {day}
                </div>
                {hours.map(hour => {
                  const value = getValue(hour, day);
                  return (
                    <div
                      key={`${day}-${hour}`}
                      className="w-3 h-6 mr-0.5 rounded-sm transition-all hover:scale-110 cursor-pointer group relative"
                      style={{ backgroundColor: getIntensity(value) }}
                      title={`${day} ${formatHour(hour)}: ${value} transactions`}
                    >
                      <div className="hidden group-hover:block absolute z-10 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        {value} txns
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            
            {/* Legend */}
            <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
              <span>Less</span>
              {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-sm"
                  style={{ backgroundColor: getIntensity(intensity * maxValue) }}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
