import { DashboardLayout } from "@/components/layout";
import { useLocation } from "react-router-dom";
import { 
  FileOutput,
  Receipt,
  CalendarRange,
  FileInput,
  ListOrdered,
} from "lucide-react";

const Documents = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getPageTitle = () => {
    if (currentPath.includes("/sent")) return "Yuborilgan";
    if (currentPath.includes("/statements")) return "Buxg. Bayonnomalari";
    if (currentPath.includes("/schedule")) return "Yillik reja jadvali";
    if (currentPath.includes("/applications")) return "Departament arizalari";
    if (currentPath.includes("/plan-list")) return "Yillik reja ro'yhati";
    return "Documents";
  };

  const getPageIcon = () => {
    if (currentPath.includes("/sent")) return FileOutput;
    if (currentPath.includes("/statements")) return Receipt;
    if (currentPath.includes("/schedule")) return CalendarRange;
    if (currentPath.includes("/applications")) return FileInput;
    if (currentPath.includes("/plan-list")) return ListOrdered;
    return FileOutput;
  };

  const PageIcon = getPageIcon();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] flex items-center justify-center">
            <PageIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{getPageTitle()}</h1>
            <p className="text-sm text-muted-foreground">Documents section</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Documents;
