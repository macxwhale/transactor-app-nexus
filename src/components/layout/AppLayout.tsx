
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Settings,
  Bell,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/",
    },
    {
      icon: CreditCard,
      label: "Applications",
      href: "/applications",
    },
    {
      icon: BarChart3,
      label: "C2B Transactions",
      href: "/c2b-transactions",
    },
    {
      icon: BarChart3,
      label: "Transactions",
      href: "/transactions",
    },
    {
      icon: Settings,
      label: "Configuration",
      href: "/config",
    },
  ];

  // Get first letter of email for avatar
  const userInitial = user?.email ? user.email[0].toUpperCase() : "U";

  return (
    <div className="min-h-screen flex overflow-hidden bg-muted/30 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar 
        navItems={navItems}
        currentPath={pathname}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="h-16 border-b border-border/40 bg-background/95 backdrop-blur-sm flex items-center justify-end px-6 gap-4 dark:border-gray-800 dark:bg-gray-900/95">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary dark:bg-primary/10">
              <span className="font-semibold text-sm">{userInitial}</span>
            </div>
            {!isMobile && (
              <div className="text-sm">
                <p className="font-medium">{user?.email || "User"}</p>
                <p className="text-muted-foreground text-xs">Administrator</p>
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>
        
        {/* Page content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
};

export default AppLayout;
