import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Clock, Zap, Target } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface EnhancedKPICardsProps {
  stats: {
    averageTransactionValue: number;
    successRateTrend: { current: number; previous: number; trend: number };
    peakHour: { hour: number; count: number };
    revenueVelocity: { perHour: number; perDay: number };
  };
}

export const EnhancedKPICards = ({ stats }: EnhancedKPICardsProps) => {
  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  const successRateTrendPositive = stats.successRateTrend.trend >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Average Transaction Value */}
      <Card className="hover-lift transition-all border-l-4 border-l-primary">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Transaction Value
            </CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(stats.averageTransactionValue)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Per transaction average
          </p>
        </CardContent>
      </Card>

      {/* Success Rate Trend */}
      <Card className="hover-lift transition-all border-l-4 border-l-success">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Success Rate Trend
            </CardTitle>
            {successRateTrendPositive ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {stats.successRateTrend.current.toFixed(1)}%
          </div>
          <p className={`text-xs mt-1 flex items-center gap-1 ${successRateTrendPositive ? 'text-success' : 'text-destructive'}`}>
            {successRateTrendPositive ? '+' : ''}{stats.successRateTrend.trend.toFixed(1)}% vs previous
          </p>
        </CardContent>
      </Card>

      {/* Peak Hour */}
      <Card className="hover-lift transition-all border-l-4 border-l-warning">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Peak Hour
            </CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatHour(stats.peakHour.hour)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.peakHour.count} transactions
          </p>
        </CardContent>
      </Card>

      {/* Revenue Velocity */}
      <Card className="hover-lift transition-all border-l-4 border-l-secondary">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue Velocity
            </CardTitle>
            <Zap className="h-4 w-4 text-secondary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(stats.revenueVelocity.perDay)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatCurrency(stats.revenueVelocity.perHour)}/hour
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
