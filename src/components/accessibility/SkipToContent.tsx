
import React from "react";
import { Button } from "@/components/ui/button";

export const SkipToContent = () => {
  const skipToMain = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  };

  return (
    <Button
      onClick={skipToMain}
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50"
      variant="outline"
    >
      Skip to main content
    </Button>
  );
};
