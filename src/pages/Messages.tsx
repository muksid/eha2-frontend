import { DashboardLayout } from "@/components/layout";
import { useLocation } from "react-router-dom";
import { 
  Mail, 
  Send, 
  Archive, 
  Users, 
  PlusCircle, 
  Edit, 
  Trash2,
} from "lucide-react";

const Messages = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getPageTitle = () => {
    if (currentPath.includes("/unread")) return "O'qilmagan xabarlar";
    if (currentPath.includes("/sent")) return "Yuborilgan xabarlar";
    if (currentPath.includes("/archive")) return "O'qilgan xabarlar (Arxiv)";
    if (currentPath.includes("/group")) return "Guruhlarga xabar yozish";
    if (currentPath.includes("/compose")) return "Xabar yozish";
    if (currentPath.includes("/create-group")) return "Guruh yaratish";
    if (currentPath.includes("/edit-group")) return "Guruhni tahrirlash";
    if (currentPath.includes("/delete-group")) return "Guruhni o'chirish";
    if (currentPath.includes("/my-groups")) return "Mening guruhlarim";
    return "Xabarlar";
  };

  const getPageIcon = () => {
    if (currentPath.includes("/unread")) return Mail;
    if (currentPath.includes("/sent")) return Send;
    if (currentPath.includes("/archive")) return Archive;
    if (currentPath.includes("/group")) return Users;
    if (currentPath.includes("/compose")) return Send;
    if (currentPath.includes("/create-group")) return PlusCircle;
    if (currentPath.includes("/edit-group")) return Edit;
    if (currentPath.includes("/delete-group")) return Trash2;
    if (currentPath.includes("/my-groups")) return Users;
    return Mail;
  };

  const PageIcon = getPageIcon();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D948FA] to-[#9968FE] flex items-center justify-center">
            <PageIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{getPageTitle()}</h1>
            <p className="text-sm text-muted-foreground">Pochta bo'limi</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messages;