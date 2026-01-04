import { LayoutDashboard, Mail, CalendarDays, Send, FileText, FolderOpen, Bell, HelpCircle, Settings, LogOut, Sun, Moon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { createContext, useContext, useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const SidebarThemeContext = createContext<{
  sidebarDark: boolean;
  toggleSidebarTheme: () => void;
}>({
  sidebarDark: true,
  toggleSidebarTheme: () => {},
});

export const useSidebarTheme = () => useContext(SidebarThemeContext);

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/", firstSubmenu: "/", gradient: "bg-gradient-to-br from-[#9333EA] via-[#7C3AED] to-[#6D28D9]", borderColor: "rgba(124, 58, 237, 0.4)" },
  { icon: Mail, label: "Pochta", path: "/messages", firstSubmenu: "/messages/group", gradient: "bg-gradient-to-b from-[#D948FA] to-[#9968FE]", borderColor: "rgba(217, 72, 250, 0.4)" },
  { icon: CalendarDays, label: "Uchrashuvlar", path: "/meeting", firstSubmenu: "/meeting", gradient: "bg-gradient-to-b from-[#20A696] to-[#66D0B8]", borderColor: "rgba(32, 166, 150, 0.4)" },
  { icon: Send, label: "Yuborilgan", path: "/sent", firstSubmenu: "/sent/tasks", gradient: "bg-gradient-to-b from-[#3B82F6] to-[#60A5FA]", borderColor: "rgba(59, 130, 246, 0.4)" },
  { icon: FileText, label: "Hujjatlar", path: "/documents", firstSubmenu: "/documents/sent", gradient: "bg-gradient-to-b from-[#F59E0B] to-[#FBBF24]", borderColor: "rgba(245, 158, 11, 0.4)" },
  { icon: FolderOpen, label: "Hujjatlarim", path: "/my-documents", firstSubmenu: "/my-documents/create", gradient: "bg-gradient-to-b from-[#EC4899] to-[#F472B6]", borderColor: "rgba(236, 72, 153, 0.4)" },
  { icon: Bell, label: "Bildirishnoma", path: "/notifications", firstSubmenu: "/notifications", gradient: "bg-gradient-to-b from-[#EF4444] to-[#F87171]", borderColor: "rgba(239, 68, 68, 0.4)" },
  { icon: HelpCircle, label: "Yordam", path: "/help", firstSubmenu: "/help", gradient: "bg-gradient-to-b from-[#6366F1] to-[#818CF8]", borderColor: "rgba(99, 102, 241, 0.4)" },
  { icon: Settings, label: "Sozlamalar", path: "/settings", firstSubmenu: "/settings", gradient: "bg-gradient-to-b from-[#64748B] to-[#94A3B8]", borderColor: "rgba(100, 116, 139, 0.4)" },
];

interface IconSidebarProps {
  sidebarDark: boolean;
  toggleSidebarTheme: () => void;
}

export const IconSidebar = ({ sidebarDark, toggleSidebarTheme }: IconSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bouncingId, setBouncingId] = useState<string | null>(null);

  const triggerBounce = useCallback((id: string) => {
    setBouncingId(id);
    setTimeout(() => setBouncingId(null), 400);
  }, []);

  const handleNavClick = (e: React.MouseEvent, item: typeof navItems[0]) => {
    e.preventDefault();
    triggerBounce(item.path);
    navigate(item.firstSubmenu);
  };

  const handleButtonClick = (id: string, callback: () => void) => {
    triggerBounce(id);
    callback();
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside 
        className={cn(
          "fixed left-0 top-14 h-[calc(100vh-56px)] w-[70px] border-r border-border z-40 flex flex-col items-center py-4 transition-all overflow-y-auto aside-scrollbar-hover group/aside",
          sidebarDark 
            ? "bg-gradient-to-b from-[#6B21A8] to-[#4C1D95]" 
            : "bg-card"
        )}
      >
        {/* Top Navigation Items */}
        <div className="flex flex-col items-center gap-3 flex-1">
          {navItems.map((item) => {
            const isActive = item.path === "/" 
              ? location.pathname === "/" 
              : location.pathname.startsWith(item.path);
            const isBouncing = bouncingId === item.path;
            return (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <a
                    href={item.firstSubmenu}
                    onClick={(e) => handleNavClick(e, item)}
                    className="flex flex-col items-center justify-center gap-1.5 group"
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full transition-all",
                        item.gradient,
                        isBouncing && "animate-bounce"
                      )}
                      style={isActive ? { 
                        boxShadow: `0 0 0 3px ${item.borderColor}`,
                      } : {}}
                    >
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className={cn(
                      "text-[10px] font-medium",
                      sidebarDark ? "text-white/80" : "text-muted-foreground",
                      isActive && (sidebarDark ? "text-white" : "text-foreground")
                    )}>
                      {item.label}
                    </span>
                  </a>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center gap-3 mt-4">
          {/* Logout */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link 
                to="/" 
                className="flex flex-col items-center gap-1.5 group" 
                onClick={() => handleButtonClick("logout", () => {})}
              >
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all",
                  bouncingId === "logout" && "animate-bounce"
                )}>
                  <LogOut className={cn("h-5 w-5", sidebarDark ? "text-white" : "text-muted-foreground")} />
                </div>
                <span className={cn(
                  "text-[10px] font-medium",
                  sidebarDark ? "text-white/80" : "text-muted-foreground"
                )}>
                  Chiqish
                </span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              Chiqish
            </TooltipContent>
          </Tooltip>

          {/* Theme Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={() => handleButtonClick("theme", toggleSidebarTheme)}
                className="flex flex-col items-center gap-1.5 cursor-pointer group"
              >
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all",
                  bouncingId === "theme" && "animate-bounce"
                )}>
                  {sidebarDark ? (
                    <Sun className="h-5 w-5 text-white" />
                  ) : (
                    <Moon className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              {sidebarDark ? "Yorug' rejim" : "Qorong'i rejim"}
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
};
