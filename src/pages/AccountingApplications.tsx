import { DashboardLayout } from "@/components/layout";
import { DollarSign } from "lucide-react";
import { useLanguage } from "@/i18n";

const AccountingApplications = () => {
  const { t } = useLanguage();
  
  return (
    <DashboardLayout>
      <div className="min-h-screen relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t('accountingApplications')}</h1>
              <p className="text-muted-foreground text-sm">Buxgalteriya arizalari</p>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-muted-foreground">Buxgalteriya arizalari ro'yxati shu yerda ko'rsatiladi</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccountingApplications;
