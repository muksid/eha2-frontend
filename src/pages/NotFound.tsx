import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { DashboardLayout } from "@/components/layout";
import { Home, ArrowLeft, Search, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-br from-[#D948FA] via-[#9968FE] to-[#3B82F6] leading-none animate-pulse">
            404
          </div>
          <div className="absolute inset-0 text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-br from-[#D948FA] via-[#9968FE] to-[#3B82F6] leading-none blur-2xl opacity-50">
            404
          </div>
          <FileQuestion className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-20 text-white/80 animate-bounce" />
        </div>

        {/* Message */}
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Sahifa topilmadi
          </h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm text-muted-foreground">
            <Search className="h-4 w-4" />
            <code className="font-mono">{location.pathname}</code>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button 
            asChild
            className="gap-2 bg-gradient-to-r from-[#D948FA] to-[#9968FE] hover:opacity-90"
          >
            <Link to="/dashboard">
              <Home className="h-4 w-4" />
              Bosh sahifaga
            </Link>
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Orqaga qaytish
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-[#D948FA]/20 to-transparent rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-[#3B82F6]/20 to-transparent rounded-full blur-xl" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-[#9968FE]/20 to-transparent rounded-full blur-xl" />
      </div>
    </DashboardLayout>
  );
};

export default NotFound;
