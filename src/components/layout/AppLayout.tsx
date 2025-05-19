
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, active }: SidebarItemProps) => {
  return (
    <Link to={href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 font-medium transition-all duration-200",
          active 
            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md" 
            : "bg-transparent text-sidebar-foreground hover:bg-sidebar-accent/50"
        )}
      >
        <Icon size={18} className={active ? "animate-pulse" : ""} />
        <span className={active ? "font-semibold" : ""}>{label}</span>
      </Button>
    </Link>
  );
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();

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
      label: "Transactions",
      href: "/transactions",
    },
    {
      icon: Settings,
      label: "Configuration",
      href: "/config",
    },
  ];

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar flex-shrink-0 flex flex-col shadow-xl overflow-hidden border-r border-sidebar-border">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105">
            <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center text-sidebar">
              <CreditCard className="h-5 w-5 text-sidebar-background" />
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">
              M-Pesa Admin
            </span>
          </Link>
        </div>
        <Separator className="bg-sidebar-border/50" />
        <div className="flex-1 p-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={pathname === item.href}
            />
          ))}
        </div>
        <div className="p-4 bg-sidebar-accent/20">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/30"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
};

export default AppLayout;
