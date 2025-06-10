
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  collapsed: boolean;
}

export const SidebarItem = ({ 
  icon: Icon, 
  label, 
  href, 
  active,
  collapsed
}: SidebarItemProps) => {
  return (
    <Link to={href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 font-medium transition-all duration-200",
          active 
            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md dark:bg-sidebar-accent/80" 
            : "bg-transparent text-sidebar-foreground hover:bg-sidebar-accent/50 dark:text-white/90 dark:hover:bg-sidebar-accent/30"
        )}
      >
        <Icon size={18} className={active ? "animate-pulse" : ""} />
        {!collapsed && <span className={active ? "font-semibold" : ""}>{label}</span>}
        {active && !collapsed && <ChevronRight className="ml-auto h-4 w-4" />}
      </Button>
    </Link>
  );
};

interface SidebarProps {
  navItems: Array<{
    icon: React.ElementType;
    label: string;
    href: string;
  }>;
  currentPath: string;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  navItems,
  currentPath,
  collapsed,
  setCollapsed
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div 
      className={cn(
        "bg-sidebar flex-shrink-0 flex flex-col shadow-elevated overflow-hidden border-r border-sidebar-border transition-all duration-300 dark:bg-gray-800 dark:border-gray-700",
        collapsed ? "w-[70px]" : "w-64"
      )}
    >
      <div className={cn("p-6", collapsed && "p-4 flex justify-center")}>
        <Link to="/" className={cn("flex items-center gap-3 transition-transform hover:scale-105", collapsed && "justify-center")}>
          <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center text-sidebar">
            <span className="h-5 w-5 text-sidebar-background font-bold">M</span>
          </div>
          {!collapsed && (
            <span className="text-xl font-bold text-sidebar-foreground dark:text-white">
              M-Pesa
            </span>
          )}
        </Link>
      </div>
      <Separator className="bg-sidebar-border/50 dark:bg-gray-700" />
      <div className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto scrollbar-none">
        {navItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={currentPath === item.href}
            collapsed={collapsed}
          />
        ))}
      </div>
      <div className="p-4 bg-sidebar-accent/20 flex flex-col gap-2 dark:bg-gray-700/50">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/30 dark:text-white/90 dark:hover:bg-gray-600/30"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronRight className={cn("h-5 w-5 transition-all", collapsed && "rotate-180")} />
          {!collapsed && <span>Collapse</span>}
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/30 dark:text-white/90 dark:hover:bg-gray-600/30"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          {!collapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </div>
  );
};
