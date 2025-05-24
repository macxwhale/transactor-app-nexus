
import React, { useState } from "react";
import { CheckSquare, Square, Trash2, Download, Archive, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export interface BulkAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  variant?: "default" | "destructive" | "outline";
  onClick: (selectedIds: string[]) => void;
}

interface BulkOperationsProps {
  selectedItems: string[];
  totalItems: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  actions: BulkAction[];
  className?: string;
}

export function BulkOperations({
  selectedItems,
  totalItems,
  onSelectAll,
  onDeselectAll,
  actions,
  className
}: BulkOperationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const isAllSelected = selectedItems.length === totalItems;
  const isPartiallySelected = selectedItems.length > 0 && selectedItems.length < totalItems;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  const handleAction = (action: BulkAction) => {
    if (selectedItems.length === 0) {
      toast.error("Please select items first");
      return;
    }
    
    action.onClick(selectedItems);
    setIsOpen(false);
  };

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 p-3 bg-muted rounded-lg ${className}`}>
      <Checkbox
        checked={isAllSelected}
        onCheckedChange={handleSelectAll}
        className="mr-2"
        aria-label={isAllSelected ? "Deselect all" : "Select all"}
      />
      
      <div className="flex items-center gap-2 flex-1">
        <Badge variant="secondary">
          {selectedItems.length} of {totalItems} selected
        </Badge>
        
        {isPartiallySelected && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectAll}
            className="text-xs"
          >
            Select All
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={onDeselectAll}
          className="text-xs"
        >
          Clear Selection
        </Button>
      </div>

      <div className="flex items-center gap-1">
        {/* Quick Actions */}
        {actions.slice(0, 2).map((action) => (
          <Button
            key={action.id}
            variant={action.variant || "outline"}
            size="sm"
            onClick={() => handleAction(action)}
            className="flex items-center gap-1"
          >
            {action.icon}
            {action.label}
          </Button>
        ))}

        {/* More Actions Dropdown */}
        {actions.length > 2 && (
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {actions.slice(2).map((action) => (
                <DropdownMenuItem
                  key={action.id}
                  onClick={() => handleAction(action)}
                  className="flex items-center gap-2"
                >
                  {action.icon}
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
