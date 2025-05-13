
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  CreditCard,
  Home,
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
          "w-full justify-start gap-2 font-normal",
          active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "bg-transparent text-sidebar-foreground"
        )}
      >
        <Icon size={20} />
        {label}
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
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar flex-shrink-0 flex flex-col">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-sidebar-foreground" />
            <span className="text-xl font-bold text-sidebar-foreground">
              M-Pesa Admin
            </span>
          </Link>
        </div>
        <Separator className="bg-sidebar-border" />
        <div className="flex-1 p-4 flex flex-col gap-1">
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
        <div className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sidebar-foreground"
          >
            <LogOut size={20} />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
};

export default AppLayout;
