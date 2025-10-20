import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info } from "lucide-react";

export interface Insight {
  id: string;
  type: 'positive' | 'negative' | 'warning' | 'info';
  title: string;
  description: string;
  metric?: string;
}

interface InsightsPanelProps {
  insights: Insight[];
}

export const InsightsPanel = ({ insights }: InsightsPanelProps) => {
  const getIcon = (type: Insight['type']) => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'info':
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  const getBadgeVariant = (type: Insight['type']) => {
    switch (type) {
      case 'positive':
        return 'default';
      case 'negative':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'info':
        return 'outline';
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">AI Insights</CardTitle>
            <CardDescription className="mt-1">
              Auto-generated observations and predictions
            </CardDescription>
          </div>
          <CheckCircle className="h-5 w-5 text-success" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No insights available yet. More data needed for analysis.
          </div>
        ) : (
          insights.map((insight) => (
            <div
              key={insight.id}
              className="flex gap-3 p-3 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors"
            >
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(insight.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-foreground">
                    {insight.title}
                  </h4>
                  <Badge variant={getBadgeVariant(insight.type)} className="text-[10px] px-1.5 py-0">
                    {insight.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {insight.description}
                </p>
                {insight.metric && (
                  <div className="mt-2 text-xs font-semibold text-primary">
                    {insight.metric}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
