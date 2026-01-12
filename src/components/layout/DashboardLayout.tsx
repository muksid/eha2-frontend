import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { IconSidebar } from "./IconSidebar";
import { MainSidebar } from "./MainSidebar";
import { Footer } from "./Footer";
import QuickActions from "./QuickActions";


interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarDark, setSidebarDark] = useState(() => {
    const stored = localStorage.getItem("sidebar-dark-mode");
    return stored !== null ? stored === "true" : true;
  });
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleSidebarTheme = () => {
    setSidebarDark(prev => {
      const newValue = !prev;
      localStorage.setItem("sidebar-dark-mode", String(newValue));
      return newValue;
    });
  };

  // Check if we should show the main sidebar (not for meeting page which has its own sidebar)
  const showMainSidebar = !location.pathname.startsWith("/meeting");

  return (
    <div className="min-h-screen h-screen bg-background flex flex-col overflow-hidden">
      {/* Navbar - Fixed at top */}
      <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Icon Sidebar - 70px fixed, below navbar */}
        <IconSidebar sidebarDark={sidebarDark} toggleSidebarTheme={toggleSidebarTheme} />
        
        {/* Collapsible Main Sidebar - below navbar */}
        {showMainSidebar && <MainSidebar isOpen={isSidebarOpen} currentPath={location.pathname} />}
        
        {/* Main Content Area */}
        <div 
          className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
            showMainSidebar && isSidebarOpen ? "ml-[345px]" : "ml-[70px]"
          }`}
        >
          {/* Page Content */}
          <main className="flex-1 p-6 pt-20 overflow-y-auto relative">
      
            {children}
            <div className="fixed bottom-[60px] right-[40%] z-50 bg-white/70 backdrop-blur-md rounded-lg shadow-lg p-2">
              <QuickActions />
            </div>
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
};