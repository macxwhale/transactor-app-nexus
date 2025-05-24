
import React, { forwardRef } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface AccessibleButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  ariaDescribedBy?: string;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ children, loading, loadingText, ariaDescribedBy, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || loading}
        aria-describedby={ariaDescribedBy}
        aria-busy={loading}
        {...props}
      >
        {loading && <LoadingSpinner size="sm" className="mr-2" />}
        {loading ? (loadingText || "Loading...") : children}
      </Button>
    );
  }
);

AccessibleButton.displayName = "AccessibleButton";
