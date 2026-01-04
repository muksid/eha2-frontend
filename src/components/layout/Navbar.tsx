import { Menu, X, Search, ChevronDown, Bell, UserCircle, Settings, LogOut, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "../assets/logo.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, Language } from "@/i18n";
import { useNavigate } from "react-router-dom";
import { CurrencyWidget } from "@/components/CurrencyWidget";
import { useTheme } from "next-themes";

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "uz", label: "O'zbek", flag: "🇺🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

const notifications = [
  { id: 1, title: "Yangi xabar", description: "Sizga yangi xabar keldi", time: "5 daqiqa oldin" },
  { id: 2, title: "Hujjat tasdiqlandi", description: "Sizning hujjatingiz tasdiqlandi", time: "1 soat oldin" },
  { id: 3, title: "Meeting eslatmasi", description: "15:00 da meeting boshlanadi", time: "2 soat oldin" },
];

export const Navbar = ({ onToggleSidebar, isSidebarOpen }: NavbarProps) => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const selectedLang = languages.find(l => l.code === language) || languages[0];

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-card border-b border-border z-50 flex items-center justify-between px-4">
     
      <div className="flex items-center">
         <img className="w-[170px]" src={Logo} alt="" />
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="shrink-0 ml-[170px]"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex items-center gap-4">
        {/* Currency Widget */}
        <CurrencyWidget />

        {/* Theme Toggle */}
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-amber-500" />
          ) : (
            <Moon className="h-5 w-5 text-muted-foreground" />
          )}
        </button>

        {/* Search Bar */}
        <div className="relative w-[240px]">
          <input
            type="text"
            placeholder={t('search')}
            className="w-full h-9 pl-4 pr-10 rounded-full bg-secondary border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary dark:border dark:border-primary"
          />
          <button className="absolute right-0 top-0 h-9 w-9 rounded-full bg-[#FB2754] flex items-center justify-center">
            <Search className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Language Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 rounded-full">
              <span>{selectedLang.flag}</span>
              <span>{selectedLang.code.toUpperCase()}</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border border-border z-[100]">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`cursor-pointer ${language === lang.code ? 'bg-[#ECDAFD] text-[#7302d5]' : ''}`}
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notification Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FB2754] text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-popover border border-border z-[100]">
            <div className="p-2 border-b border-border">
              <h4 className="font-semibold text-sm">{t('notifications')}</h4>
            </div>
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="cursor-pointer flex flex-col items-start gap-1 p-3"
              >
                <span className="font-medium text-sm">{notification.title}</span>
                <span className="text-xs text-muted-foreground">{notification.description}</span>
                <span className="text-xs text-muted-foreground/70">{notification.time}</span>
              </DropdownMenuItem>
            ))}
            <div className="p-2 border-t border-border">
              <button className="w-full text-center text-sm text-primary hover:underline">
                {t('viewAll')}
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden" style={{ background: "linear-gradient(to bottom, #EC4899, #8B5CF6)" }}>
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = 'SK';
                }}
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card border border-border dark:border-white/20 z-[100] shadow-lg rounded-xl p-1">
            <div className="px-3 py-2 border-b border-border mb-1">
              <p className="text-sm font-semibold text-foreground">Shamsiddin K</p>
              <p className="text-xs text-muted-foreground">Frontend developer</p>
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
        </DropdownMenu>
      </div>
    </nav>
  );
};