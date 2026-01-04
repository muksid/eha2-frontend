import { DashboardLayout } from "@/components/layout";

const Settings = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your preferences</p>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
