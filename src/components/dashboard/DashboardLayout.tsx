
import React from "react";

interface DashboardLayoutProps {
  isLoading: boolean;
  stats: any;
  loadingView: React.ReactNode;
  errorView: React.ReactNode;
  contentView: React.ReactNode;
}

export const DashboardLayout = ({
  isLoading,
  stats,
  loadingView,
  errorView,
  contentView,
}: DashboardLayoutProps) => {
  if (isLoading) {
    return loadingView;
  }

  if (!stats) {
    return errorView;
  }

  return contentView;
};
