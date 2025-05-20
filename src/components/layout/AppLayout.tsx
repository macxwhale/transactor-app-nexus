
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  ChevronRight,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { useMediaQuery } from "@/hooks/use-mobile";

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
        {active && <ChevronRight className="ml-auto h-4 w-4" />}
      </Button>
    </Link>
  );
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [collapsed, setCollapsed] = React.useState(false);

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
    <div className="min-h-screen flex overflow-hidden bg-muted/30">
      {/* Sidebar */}
      <div 
        className={cn(
          "bg-sidebar flex-shrink-0 flex flex-col shadow-elevated overflow-hidden border-r border-sidebar-border transition-all duration-300",
          collapsed ? "w-[70px]" : "w-64"
        )}
      >
        <div className={cn("p-6", collapsed && "p-4 flex justify-center")}>
          <Link to="/" className={cn("flex items-center gap-3 transition-transform hover:scale-105", collapsed && "justify-center")}>
            <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center text-sidebar">
              <CreditCard className="h-5 w-5 text-sidebar-background" />
            </div>
            {!collapsed && (
              <span className="text-xl font-bold text-sidebar-foreground">
                M-Pesa
              </span>
            )}
          </Link>
        </div>
        <Separator className="bg-sidebar-border/50" />
        <div className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto scrollbar-none">
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
        <div className="p-4 bg-sidebar-accent/20 flex flex-col gap-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/30"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronRight className={cn("h-5 w-5 transition-all", collapsed && "rotate-180")} />
            {!collapsed && <span>Collapse</span>}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/30"
          >
            <LogOut size={18} />
            {!collapsed && <span>Sign Out</span>}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="h-16 border-b border-border/40 bg-background/95 backdrop-blur-sm flex items-center justify-end px-6 gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary">
              <span className="font-semibold text-sm">JD</span>
            </div>
            {!isMobile && (
              <div className="text-sm">
                <p className="font-medium">John Doe</p>
                <p className="text-muted-foreground text-xs">Administrator</p>
              </div>
            )}
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
