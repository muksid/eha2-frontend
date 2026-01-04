import { DashboardLayout } from "@/components/layout";

const Calendar = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
        <p className="text-muted-foreground mt-1">View your schedule</p>
      </div>
    </DashboardLayout>
  );
};

export default Calendar;
