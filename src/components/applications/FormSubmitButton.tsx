
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormSubmitButtonProps {
  isSubmitting: boolean;
  isEditing?: boolean;
  className?: string;
}

const FormSubmitButton = ({
  isSubmitting,
  isEditing = false,
  className = "w-full",
}: FormSubmitButtonProps) => {
  return (
    <Button type="submit" className={className} disabled={isSubmitting}>
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isEditing ? "Updating..." : "Registering..."}
        </>
      ) : (
        isEditing ? "Update Application" : "Register Application"
      )}
    </Button>
  );
};

export default FormSubmitButton;
