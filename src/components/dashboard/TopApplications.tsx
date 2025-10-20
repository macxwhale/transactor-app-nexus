
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TopApplicationsProps {
  topApplications: Array<{ name: string; transactions: number; amount: number }>;
}

export const TopApplications = ({ topApplications }: TopApplicationsProps) => {
  const maxTransactions = Math.max(...topApplications.map(app => app.transactions), 1);
  const totalAmount = topApplications.reduce((sum, app) => sum + app.amount, 0);
  
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Top Applications
            </CardTitle>
            <CardDescription className="mt-1">
              Highest performing by transaction volume
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {topApplications.length > 0 ? (
          <div className="space-y-4">
            {topApplications.slice(0, 5).map((app, i) => {
              const percentage = (app.transactions / maxTransactions) * 100;
              const amountPercentage = totalAmount > 0 ? (app.amount / totalAmount) * 100 : 0;
              
              return (
                <div key={i} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <div className="text-sm font-semibold group-hover:text-primary transition-colors">
                          {app.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {app.transactions.toLocaleString()} transactions
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-foreground">
                        {formatCurrency(app.amount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {amountPercentage.toFixed(1)}% of total
                      </div>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No application data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
