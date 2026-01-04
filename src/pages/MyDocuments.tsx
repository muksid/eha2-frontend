import { DashboardLayout } from "@/components/layout";
import { useLocation } from "react-router-dom";
import { 
  FilePenLine,
  FileSpreadsheet,
  Briefcase,
  FileX,
  UserCircle,
} from "lucide-react";

const MyDocuments = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getPageTitle = () => {
    if (currentPath.includes("/create")) return "Hujjat yaratish";
    if (currentPath.includes("/applications")) return "Mening arizalarim";
    if (currentPath.includes("/work-docs")) return "Ishchi hujjatlar";
    if (currentPath.includes("/outgoing")) return "Kans. Chiquvchi hujjatlar";
    if (currentPath.includes("/personal")) return "Shaxsiy ish (HR)";
    return "My Documents";
  };

  const getPageIcon = () => {
    if (currentPath.includes("/create")) return FilePenLine;
    if (currentPath.includes("/applications")) return FileSpreadsheet;
    if (currentPath.includes("/work-docs")) return Briefcase;
    if (currentPath.includes("/outgoing")) return FileX;
    if (currentPath.includes("/personal")) return UserCircle;
    return FilePenLine;
  };

  const PageIcon = getPageIcon();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#EC4899] to-[#F472B6] flex items-center justify-center">
            <PageIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{getPageTitle()}</h1>
            <p className="text-sm text-muted-foreground">My Documents section</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyDocuments;
