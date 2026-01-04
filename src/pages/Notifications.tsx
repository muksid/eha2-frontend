import { DashboardLayout } from "@/components/layout";

const Notifications = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground mt-1">Your notifications</p>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
