import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Mail, 
  Users, 
  Send,
  Archive,
  MessageSquare,
  CheckSquare,
  FileCheck,
  FileSignature,
  Handshake,
  FilePlus,
  ClipboardSignature,
  FileOutput,
  Receipt,
  CalendarRange,
  FileInput,
  ListOrdered,
  FilePenLine,
  FileSpreadsheet,
  Briefcase,
  FileX,
  UserCircle,
  PlusCircle,
  Edit,
  Trash2,
  LayoutDashboard,
  ChevronDown,
  Settings,
  LogOut,
  FileText,
  Shield,
  Bell,
  DollarSign,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/i18n";

interface MainSidebarProps {
  isOpen: boolean;
  currentPath: string;
}

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  translationKey?: string;
  path: string;
  count?: number;
}

const STORAGE_KEY = "dashboard-menu-items";

const profiles = [
  { name: "Shamsiddin K", role: "Frontend developer", initials: "S", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { name: "Abdulloh T", role: "Backend developer", initials: "A", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { name: "Jasur M", role: "UI/UX Designer", initials: "J", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
];

const ProfileSection = () => {
  const [currentProfileIndex] = useState(0);
  const currentProfile = profiles[currentProfileIndex];
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div >
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full flex items-center justify-between hover:bg-secondary/50 rounded-lg p-2 -m-2 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#8e44ec] to-[#cf5fe2] flex items-center justify-center text-white font-bold text-sm border-2 border-white/30 shadow-lg">
                {currentProfile.initials}
              </div>
              <div className="min-w-0 text-left">
                <p className="text-sm font-semibold text-foreground truncate">{currentProfile.name}</p>
                <p className="text-xs text-muted-foreground truncate">{currentProfile.role}</p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="start" 
          className="w-[243px] bg-card border border-border dark:border-white/20 shadow-lg rounded-xl p-1"
          sideOffset={8}
        >
          <div className="px-3 py-2 border-b border-border mb-1 bg-gradient-to-r from-[#8e44ec]/10 to-[#cf5fe2]/5 rounded-t-lg">
            <p className="text-sm font-semibold text-foreground">{currentProfile.name}</p>
            <p className="text-xs text-muted-foreground">{currentProfile.role}</p>
          </div>
          <DropdownMenuItem 
            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg hover:bg-[#ECDAFD] hover:text-[#7302d5] transition-colors"
            onClick={() => navigate('/settings')}
          >
            <div className="w-8 h-8 rounded-full bg-[#ECDAFD] flex items-center justify-center">
              <UserCircle className="h-4 w-4 text-[#8e44ec]" />
            </div>
            <span className="font-medium">{t('profile')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg hover:bg-[#ECDAFD] hover:text-[#7302d5] transition-colors"
            onClick={() => navigate('/settings')}
          >
            <div className="w-8 h-8 rounded-full bg-[#ECDAFD] flex items-center justify-center">
              <Settings className="h-4 w-4 text-[#8e44ec]" />
            </div>
            <span className="font-medium">{t('settings')}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem 
            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
              <LogOut className="h-4 w-4 text-destructive" />
            </div>
            <span className="font-medium">{t('logout')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </div>
  );
};

export const MainSidebar = ({ isOpen, currentPath }: MainSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"xabarlar" | "guruhlar">("xabarlar");
  const [dashboardItems, setDashboardItems] = useState<MenuItem[]>([]);

  // Menu items with translation keys
  const messageMenuItems: MenuItem[] = [
    { icon: Users, label: t('writeToGroups'), path: "/messages/group" },
    { icon: Send, label: t('composeMessage'), path: "/messages/compose" },
  ];

  const messagesSection: MenuItem[] = [
    { icon: Mail, label: t('unreadMessages'), path: "/messages/unread", count: 5 },
    { icon: Send, label: t('sentMessages'), path: "/messages/sent", count: 12 },
    { icon: Archive, label: t('archiveMessages'), path: "/messages/archive", count: 48 },
  ];

  const guruhlarSection: MenuItem[] = [
    { icon: PlusCircle, label: t('createGroup'), path: "/messages/create-group" },
    { icon: Edit, label: t('editGroup'), path: "/messages/edit-group" },
    { icon: Trash2, label: t('deleteGroup'), path: "/messages/delete-group" },
    { icon: Users, label: t('myGroups'), path: "/messages/my-groups" },
  ];

  const sentSubmenus: MenuItem[] = [
    { icon: CheckSquare, label: t('forExecution'), path: "/sent/tasks", count: 3 },
    { icon: FileCheck, label: t('hrOrders'), path: "/sent/hr-orders", count: 1 },
    { icon: FileSignature, label: t('hrXsb'), path: "/sent/hr-xsb", count: 0 },
    { icon: Handshake, label: t('forAgreement'), path: "/sent/agreements", count: 2 },
    { icon: FilePlus, label: t('additionalAgreements'), path: "/sent/additional", count: 0 },
    { icon: ClipboardSignature, label: t('hrProtocols'), path: "/sent/protocols", count: 1 },
  ];

  const documentsSubmenus: MenuItem[] = [
    { icon: FileOutput, label: t('sentDocuments'), path: "/documents/sent", count: 8 },
    { icon: Receipt, label: t('accountingStatements'), path: "/documents/statements", count: 4 },
    { icon: CalendarRange, label: t('annualSchedule'), path: "/documents/schedule", count: 1 },
    { icon: FileInput, label: t('departmentApplications'), path: "/documents/applications", count: 6 },
    { icon: ListOrdered, label: t('annualPlanList'), path: "/documents/plan-list", count: 2 },
  ];

  const myDocumentsSubmenus: MenuItem[] = [
    { icon: FilePenLine, label: t('createDocument'), path: "/my-documents/create" },
    { icon: FileSpreadsheet, label: t('myApplications'), path: "/my-documents/applications", count: 3 },
    { icon: Briefcase, label: t('workDocuments'), path: "/my-documents/work-docs", count: 15 },
    { icon: FileX, label: t('outgoingDocuments'), path: "/my-documents/outgoing", count: 2 },
    { icon: UserCircle, label: t('personalFile'), path: "/my-documents/personal" },
  ];

  // Arizalar section
  const arizalarSubmenus: MenuItem[] = [
    { icon: FileText, label: t('hrApplications'), path: "/applications/hr", count: 4 },
    { icon: DollarSign, label: t('accountingApplications'), path: "/applications/accounting", count: 2 },
    { icon: Shield, label: t('securityApplications'), path: "/applications/security", count: 1 },
    { icon: Bell, label: t('notifications'), path: "/applications/notifications", count: 7 },
  ];

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setDashboardItems(parsed);
      } catch (e) {
        console.error("Failed to parse dashboard items", e);
      }
    }
  }, []);

  const addToDashboard = (item: MenuItem) => {
    const exists = dashboardItems.some((i) => i.path === item.path);
    if (!exists) {
      const newItems = [...dashboardItems, { label: item.label, path: item.path, count: item.count, icon: item.icon }];
      setDashboardItems(newItems);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems.map(i => ({
        label: i.label,
        path: i.path,
        count: i.count,
      }))));
    }
  };

  const removeFromDashboard = (path: string) => {
    const newItems = dashboardItems.filter((i) => i.path !== path);
    setDashboardItems(newItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems.map(i => ({
      label: i.label,
      path: i.path,
      count: i.count,
    }))));
  };

  const getTabBgColor = (tab: string) => {
    return activeTab === tab ? "bg-[#cf5fe2] text-white" : "bg-secondary text-muted-foreground hover:bg-secondary/80";
  };

  // Determine which sidebar content to show based on currentPath
  const isHomeSection = currentPath === "/" || currentPath.startsWith("/home");
  const isMessagesSection = currentPath.startsWith("/messages");
  const isSentSection = currentPath.startsWith("/sent");
  const isDocumentsSectionWithSub = currentPath.startsWith("/documents");
  const isMyDocumentsSection = currentPath.startsWith("/my-documents");
  const isApplicationsSection = currentPath.startsWith("/applications");

  // Set first submenu as active when entering a section
  useEffect(() => {
    if (location.pathname === "/messages") {
      navigate("/messages/group", { replace: true });
    } else if (location.pathname === "/sent") {
      navigate("/sent/tasks", { replace: true });
    } else if (location.pathname === "/documents") {
      navigate("/documents/sent", { replace: true });
    } else if (location.pathname === "/my-documents") {
      navigate("/my-documents/create", { replace: true });
    } else if (location.pathname === "/applications") {
      navigate("/applications/hr", { replace: true });
    }
  }, [location.pathname, navigate]);

  const renderSubmenuItem = (item: MenuItem, showContextMenu = true) => {
    const isActive = location.pathname === item.path;
    const content = (
      <Link
        to={item.path}
        className={cn(
          "flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm animate-fade-in group/item",
          isActive
            ? "bg-[#ECDAFD] text-[#7302d5]"
            : "text-muted-foreground hover:bg-[#ECDAFD] hover:text-[#7302d5]"
        )}
        title={item.label}
      >
        <div className="flex items-center gap-3 min-w-0">
          <item.icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-[#7302d5]" : "")} />
          <span className="truncate max-w-[155px]">{item.label}</span>
        </div>
        {item.count !== undefined && item.count > 0 && (
          <span className="bg-[#8e44ec] text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">{item.count}</span>
        )}
      </Link>
    );

    if (!showContextMenu) return content;

    return (
      <ContextMenu key={item.path}>
        <ContextMenuTrigger asChild>{content}</ContextMenuTrigger>
        <ContextMenuContent className="w-56 bg-card border border-border">
          <ContextMenuItem
            className="flex items-center gap-2 cursor-pointer hover:bg-[#ECDAFD] hover:text-[#7302d5]"
            onClick={() => addToDashboard(item)}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>{t('addToDashboard')}</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  const renderDashboardSubmenuItem = (item: MenuItem) => {
    const isActive = location.pathname === item.path;
    const IconComponent = getIconForPath(item.path);
    
    return (
      <ContextMenu key={item.path}>
        <ContextMenuTrigger asChild>
          <Link
            to={item.path}
            className={cn(
              "flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm animate-fade-in",
              isActive
                ? "bg-[#ECDAFD] text-[#7302d5]"
                : "text-muted-foreground hover:bg-[#ECDAFD] hover:text-[#7302d5]"
            )}
            title={item.label}
          >
            <div className="flex items-center gap-3 min-w-0">
              <IconComponent className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-[#7302d5]" : "")} />
              <span className="truncate max-w-[155px]">{item.label}</span>
            </div>
            {item.count !== undefined && item.count > 0 && (
              <span className="bg-[#8e44ec] text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">{item.count}</span>
            )}
          </Link>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56 bg-card border border-border">
          <ContextMenuItem
            className="flex items-center gap-2 cursor-pointer hover:bg-[#ECDAFD] hover:text-[#7302d5]"
            onClick={() => removeFromDashboard(item.path)}
          >
            <Trash2 className="h-4 w-4" />
            <span>{t('removeFromDashboard')}</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  const getIconForPath = (path: string): React.ComponentType<{ className?: string }> => {
    const allItems = [...sentSubmenus, ...documentsSubmenus, ...myDocumentsSubmenus, ...messagesSection, ...guruhlarSection, ...messageMenuItems, ...arizalarSubmenus];
    const item = allItems.find(i => i.path === path);
    return item?.icon || FileOutput;
  };

  const renderDashboardContent = () => (
    <>
      <h3 className="text-sm font-semibold text-foreground mb-3">{t('dashboard')}</h3>
      {dashboardItems.length === 0 ? (
        <p className="text-sm text-muted-foreground px-3">
          {t('dashboardEmpty')}
        </p>
      ) : (
        <nav className="space-y-1">
          {dashboardItems.map(renderDashboardSubmenuItem)}
        </nav>
      )}

      <div className="mt-6 pt-4 border-t dark:border-white/20 border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3">{t('applications')}</h3>
        <nav className="space-y-1">
          {arizalarSubmenus.map((item) => renderSubmenuItem(item))}
        </nav>
      </div>
    </>
  );

  const renderMessagesContent = () => (
    <>
      {/* Tab Navigation */}
      <div className="flex gap-1 mb-4 p-1 bg-secondary rounded-lg">
        <button
          onClick={() => setActiveTab("xabarlar")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors",
            getTabBgColor("xabarlar")
          )}
        >
          <MessageSquare className="h-3 w-3" />
          {t('messages')}
        </button>
        <button
          onClick={() => setActiveTab("guruhlar")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors",
            getTabBgColor("guruhlar")
          )}
        >
          <Users className="h-3 w-3" />
          {t('groups')}
        </button>
      </div>

      {activeTab === "xabarlar" ? (
        <>
          {/* Xabar yozish Section */}
          <h3 className="text-sm font-semibold text-foreground mb-3">{t('writeMessage')}</h3>
          <nav className="space-y-1 mb-6">
            {messageMenuItems.map((item) => renderSubmenuItem(item))}
          </nav>

          {/* Xabarlar Section */}
          <h3 className="text-sm font-semibold text-foreground mb-3">{t('messages')}</h3>
          <nav className="space-y-1">
            {messagesSection.map((item) => renderSubmenuItem(item))}
          </nav>
        </>
      ) : (
        <>
          {/* Guruhlar Section */}
          <h3 className="text-sm font-semibold text-foreground mb-3">{t('groups')}</h3>
          <nav className="space-y-1">
            {guruhlarSection.map((item) => renderSubmenuItem(item))}
          </nav>
        </>
      )}
    </>
  );

  const renderSentContent = () => (
    <>
      <h3 className="text-sm font-semibold text-foreground mb-3">{t('sent')}</h3>
      <nav className="space-y-1">
        {sentSubmenus.map((item) => renderSubmenuItem(item))}
      </nav>
    </>
  );

  const renderDocumentsContent = () => (
    <>
      <h3 className="text-sm font-semibold text-foreground mb-3">{t('documents')}</h3>
      <nav className="space-y-1">
        {documentsSubmenus.map((item) => renderSubmenuItem(item))}
      </nav>
    </>
  );

  const renderMyDocumentsContent = () => (
    <>
      <h3 className="text-sm font-semibold text-foreground mb-3">{t('myDocuments')}</h3>
      <nav className="space-y-1">
        {myDocumentsSubmenus.map((item) => renderSubmenuItem(item))}
      </nav>
    </>
  );

  const renderApplicationsContent = () => (
    <>
      <h3 className="text-sm font-semibold text-foreground mb-3">{t('applications')}</h3>
      <nav className="space-y-1">
        {arizalarSubmenus.map((item) => renderSubmenuItem(item))}
        
      </nav>
     
    </>
  );

  return (
    <aside
      className={cn(
        "fixed left-[70px] top-14 h-[calc(100vh-56px)] w-[275px] bg-card border-r border-border z-30 transition-transform duration-300 overflow-y-auto sidebar-scrollbar flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Profile Section */}
      <ProfileSection />

      {/* Sidebar Content */}
      <div className="p-4 flex-1">
        {isHomeSection && renderDashboardContent()}
        {isMessagesSection && renderMessagesContent()}
        {isSentSection && renderSentContent()}
        {isDocumentsSectionWithSub && !isSentSection && !isMyDocumentsSection && !isApplicationsSection && renderDocumentsContent()}
        {isMyDocumentsSection && renderMyDocumentsContent()}
        {isApplicationsSection && renderApplicationsContent()}
     
      </div>
    </aside>
  );
};