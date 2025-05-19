
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Settings } from "lucide-react";
import ApiDomainForm from "./ApiDomainForm";

interface ApiConfigurationCardProps {
  apiDomain: string;
  onDomainChange: (domain: string) => void;
}

const ApiConfigurationCard = ({ apiDomain, onDomainChange }: ApiConfigurationCardProps) => {
  return (
    <Card className="hover-lift">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/80 to-secondary/80" />
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            API Configuration
          </CardTitle>
          <CardDescription>
            Set up your API domain for all endpoints
          </CardDescription>
        </div>
        <div className="bg-muted/50 text-muted-foreground text-xs px-2 py-1 rounded-md">
          {apiDomain ? 'Connected' : 'Not configured'}
        </div>
      </CardHeader>
      <CardContent>
        <ApiDomainForm 
          initialDomain={apiDomain} 
          onDomainChange={onDomainChange}
        />
      </CardContent>
      <CardFooter className="pt-0">
        {/* Footer content if needed in the future */}
      </CardFooter>
    </Card>
  );
};

export default ApiConfigurationCard;
