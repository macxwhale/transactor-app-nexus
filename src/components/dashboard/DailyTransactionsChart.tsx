
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChartProps {
  dailyStats: Array<{ date: string; count: number; amount: number }>;
}

export const DailyTransactionsChart = ({ dailyStats }: ChartProps) => {
  const navigate = useNavigate();
  const totalTransactions = dailyStats.reduce((sum, day) => sum + day.count, 0);
  const avgTransactions = (totalTransactions / dailyStats.length).toFixed(0);
  
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Transaction Trends</CardTitle>
            <CardDescription className="mt-1">
              Daily volume and amount over the past 7 days
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-xs">Avg: {avgTransactions}/day</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[320px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dailyStats} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                });
              }}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => value.toLocaleString()}
              width={50}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => `KES ${(value / 1000).toFixed(0)}K`}
              width={70}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const date = new Date(label);
                return (
                  <div className="rounded-lg border bg-card p-3 shadow-lg">
                    <p className="text-sm font-medium mb-2">
                      {date.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                    <div className="space-y-1">
                      {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-4 text-xs">
                          <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            {entry.name}:
                          </span>
                          <span className="font-semibold">
                            {entry.name === 'Amount' 
                              ? `KES ${entry.value.toLocaleString()}` 
                              : entry.value.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }}
            />
            <Area 
              yAxisId="left"
              type="monotone"
              dataKey="count" 
              name="Transactions"
              stroke="hsl(var(--primary))" 
              strokeWidth={2.5}
              fill="url(#colorCount)"
              animationDuration={1000}
              cursor="pointer"
              onClick={(data: any) => {
                if (data && data.date) {
                  navigate(`/transactions?date=${data.date}`);
                }
              }}
            />
            <Area 
              yAxisId="right"
              type="monotone"
              dataKey="amount" 
              name="Amount"
              stroke="hsl(var(--secondary))" 
              strokeWidth={2.5}
              fill="url(#colorAmount)"
              animationDuration={1000}
              cursor="pointer"
              onClick={(data: any) => {
                if (data && data.date) {
                  navigate(`/transactions?date=${data.date}`);
                }
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
