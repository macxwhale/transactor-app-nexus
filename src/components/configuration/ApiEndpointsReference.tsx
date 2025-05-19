
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Server } from "lucide-react";

const ApiEndpointsReference = () => {
  return (
    <Card className="hover-lift">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/80 to-secondary/80" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5 text-primary" />
          API Endpoints
        </CardTitle>
        <CardDescription>
          Reference for available API endpoints
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Login</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Authenticate with the API using an app ID
            </p>
            <div className="bg-muted p-3 rounded-md font-mono text-sm">
              POST /login
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">Transaction Query</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Query transaction status by checkout request ID
            </p>
            <div className="bg-muted p-3 rounded-md font-mono text-sm">
              POST /express/query
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Headers required: App-ID
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">Get Transactions</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Retrieve transaction data with optional filters
            </p>
            <div className="bg-muted p-3 rounded-md font-mono text-sm">
              GET /transactions
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">Dashboard Stats</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Get dashboard statistics and metrics
            </p>
            <div className="bg-muted p-3 rounded-md font-mono text-sm">
              GET /stats/dashboard
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiEndpointsReference;
