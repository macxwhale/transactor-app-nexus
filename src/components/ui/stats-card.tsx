
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  className,
  trend,
}: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden hover-lift", className)}>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/80 to-secondary/80" />
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-5 w-5 text-primary">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            {trend && (
              <span className={cn(
                "inline-flex items-center mr-1 text-xs font-medium",
                trend.positive ? "text-success" : "text-destructive"
              )}>
                <span className={cn(
                  "mr-0.5",
                  trend.positive ? "text-success" : "text-destructive"
                )}>
                  {trend.positive ? '↑' : '↓'}
                </span>
                {Math.abs(trend.value)}%
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
