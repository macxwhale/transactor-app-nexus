
import React, { useState, useEffect } from "react";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AppCredentialsSectionProps {
  appId?: string;
  appSecret?: string;
}

const AppCredentialsSection = ({ appId, appSecret }: AppCredentialsSectionProps) => {
  const [isSecretVisible, setIsSecretVisible] = useState(false);
  
  // Auto-mask after 30 seconds of inactivity when secret is visible
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isSecretVisible) {
      timeoutId = setTimeout(() => {
        setIsSecretVisible(false);
      }, 30000); // 30 seconds
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isSecretVisible]);

  // Function to copy text to clipboard
  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(`${fieldName} copied to clipboard`))
      .catch(() => toast.error(`Failed to copy ${fieldName}`));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 p-3 rounded-md border">
      <div>
        <FormLabel htmlFor="app_id">App ID (Not editable)</FormLabel>
        <div className="flex mt-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative flex-1">
                  <Input 
                    id="app_id"
                    value={appId || ""}
                    className="bg-muted/30 pr-10" 
                    readOnly
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>This field cannot be edited</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="ml-2"
            onClick={() => copyToClipboard(appId || "", "App ID")}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div>
        <FormLabel htmlFor="app_secret">App Secret (Not editable)</FormLabel>
        <div className="flex mt-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative flex-1">
                  <Input 
                    id="app_secret"
                    value={isSecretVisible 
                      ? appSecret || "" 
                      : "•".repeat(Math.min(12, (appSecret || "").length))}
                    className="bg-muted/30 pr-10" 
                    readOnly
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>This field cannot be edited</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="ml-2"
            onClick={() => setIsSecretVisible(!isSecretVisible)}
          >
            {isSecretVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="ml-2"
            onClick={() => copyToClipboard(appSecret || "", "App Secret")}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppCredentialsSection;
