import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/i18n";

// Pages
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import Meeting from "./pages/Meeting";
import Sent from "./pages/Sent";
import Documents from "./pages/Documents";
import MyDocuments from "./pages/MyDocuments";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import HRApplications from "./pages/HRApplications";
import AccountingApplications from "./pages/AccountingApplications";
import SecurityApplications from "./pages/SecurityApplications";
import NotificationsApplications from "./pages/NotificationsApplications";


const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/messages/*" element={<Messages />} />
              <Route path="/meeting" element={<Meeting />} />
              <Route path="/sent" element={<Sent />} />
              <Route path="/sent/*" element={<Sent />} />
              
              <Route path="/documents" element={<Documents />} />
              <Route path="/documents/*" element={<Documents />} />
              <Route path="/my-documents" element={<MyDocuments />} />
              <Route path="/my-documents/*" element={<MyDocuments />} />
              <Route path="/applications" element={<HRApplications />} />
              <Route path="/applications/hr" element={<HRApplications />} />
              <Route path="/applications/accounting" element={<AccountingApplications />} />
              <Route path="/applications/security" element={<SecurityApplications />} />
              <Route path="/applications/notifications" element={<NotificationsApplications />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<Help />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
