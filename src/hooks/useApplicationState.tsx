
import { useState } from "react";
import { Application } from "@/lib/api";

export function useApplicationState() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  return {
    applications,
    setApplications,
    isLoading,
    setIsLoading
  };
}
