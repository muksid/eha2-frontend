import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { LayoutDashboard, Trash2 } from "lucide-react";

interface MenuItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

interface SubMenuContextMenuProps {
  children: React.ReactNode;
  menuItem: MenuItem;
  onAddToDashboard: (item: MenuItem) => void;
  onRemoveFromDashboard?: (item: MenuItem) => void;
  isDashboardItem?: boolean;
}

export const SubMenuContextMenu = ({
  children,
  menuItem,
  onAddToDashboard,
  onRemoveFromDashboard,
  isDashboardItem = false,
}: SubMenuContextMenuProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56 bg-card border border-border">
        {isDashboardItem && onRemoveFromDashboard ? (
          <ContextMenuItem
            className="flex items-center gap-2 cursor-pointer hover:bg-[#ECDAFD] hover:text-[#7302d5]"
            onClick={() => onRemoveFromDashboard(menuItem)}
          >
            <Trash2 className="h-4 w-4" />
            <span>Dashboarddan o'chirish</span>
          </ContextMenuItem>
        ) : (
          <ContextMenuItem
            className="flex items-center gap-2 cursor-pointer hover:bg-[#ECDAFD] hover:text-[#7302d5]"
            onClick={() => onAddToDashboard(menuItem)}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboardga qo'shish</span>
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};