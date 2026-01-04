import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { IconSidebar } from "@/components/layout/IconSidebar";
import { MeetingSidebar } from "@/components/MeetingSidebar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Sparkles, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { MeetingDialog, Meeting } from "@/components/MeetingDialog";

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

const weekDays = ["Mon 04", "Tue 05", "Wed 06", "Thu 07", "Fri 08"];

interface MeetingData {
  [key: string]: Meeting | null;
}

const initialMeetings: MeetingData = {
  "08:00-Mon 04": { id: "m1", title: "Team Standup", participants: ["Aziz K", "Dilnoza R"], duration: "1h", color: "bg-emerald-600" },
  "10:00-Tue 05": { id: "m2", title: "Client Meeting", participants: ["Bobur A"], duration: "2h", color: "bg-blue-600" },
  "14:00-Wed 06": { id: "m3", title: "Project Review", participants: ["Malika T", "Jasur N"], duration: "1h", color: "bg-orange-500" },
  "09:00-Thu 07": { id: "m4", title: "Training Session", participants: ["Sardor Y"], duration: "3h", color: "bg-purple-600" },
  "15:00-Fri 08": { id: "m5", title: "Sprint Planning", participants: ["Nodira H", "Aziz K"], duration: "2h", color: "bg-emerald-600" },
};

const MeetingPage = () => {
  const [meetings, setMeetings] = useState<MeetingData>(initialMeetings);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [sidebarDark, setSidebarDark] = useState(() => {
    const stored = localStorage.getItem("sidebar-dark-mode");
    return stored !== null ? stored === "true" : true;
  });

  const toggleSidebarTheme = () => {
    setSidebarDark(prev => {
      const newValue = !prev;
      localStorage.setItem("sidebar-dark-mode", String(newValue));
      return newValue;
    });
  };

  const handleCellClick = (time: string, day: string) => {
    const key = `${time}-${day}`;
    setSelectedCell(key);
    setEditingMeeting(meetings[key] || null);
    setDialogOpen(true);
  };

  const handleSaveMeeting = (meetingData: Omit<Meeting, "id"> & { id?: string }) => {
    if (!selectedCell) return;

    setMeetings((prev) => ({
      ...prev,
      [selectedCell]: {
        id: meetingData.id || `m${Date.now()}`,
        title: meetingData.title,
        participants: meetingData.participants,
        duration: meetingData.duration,
        color: meetingData.color,
      },
    }));

    setSelectedCell(null);
    setEditingMeeting(null);
  };

  const handleDeleteMeeting = () => {
    if (!selectedCell) return;

    setMeetings((prev) => {
      const newMeetings = { ...prev };
      delete newMeetings[selectedCell];
      return newMeetings;
    });

    setDialogOpen(false);
    setSelectedCell(null);
    setEditingMeeting(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onToggleSidebar={() => {}} isSidebarOpen={true} />
      
      <div className="flex pt-14 flex-1">
        <IconSidebar sidebarDark={sidebarDark} toggleSidebarTheme={toggleSidebarTheme} />
        
        <div className="ml-[70px] flex flex-1 flex-col">
          <div className="flex flex-1">
            <MeetingSidebar />
            
            <main className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-semibold text-foreground">Scheduled Meetings</h1>
                  
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium text-primary">Today</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    
                    <Button variant="outline" size="sm" className="gap-2">
                      <Sparkles className="h-4 w-4" />
                      Auto Schedule
                    </Button>
                  </div>
                </div>

                {/* Schedule Table */}
                <div className="bg-card rounded-lg border dark:border-white/20 border-border overflow-hidden">
                  <div className="grid grid-cols-[100px_repeat(5,1fr)] bg-muted/50 border-b dark:border-white/20 border-border">
                    <div className="p-3 flex items-center">
                      <span className="text-sm font-medium text-muted-foreground">Time</span>
                    </div>
                    {weekDays.map((day) => (
                      <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground border-l dark:border-white/20 border-border">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div>
                    {timeSlots.map((time) => (
                      <div key={time} className="grid grid-cols-[100px_repeat(5,1fr)] border-b dark:border-white/20 border-border last:border-b-0">
                        <div className="p-3 flex items-center justify-center bg-muted/20">
                          <span className="text-sm font-medium text-muted-foreground">{time}</span>
                        </div>
                        
                        {weekDays.map((day) => {
                          const key = `${time}-${day}`;
                          const meeting = meetings[key];
                          return (
                            <div
                              key={day}
                              className="p-2 border-l dark:border-white/20 border-border cursor-pointer hover:bg-muted/30 transition-colors min-h-[60px]"
                              onClick={() => handleCellClick(time, day)}
                            >
                              {meeting ? (
                                <div className={cn("rounded-md p-2 text-white text-xs h-full", meeting.color)}>
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">{meeting.title}</span>
                                    <span className="text-white/80">{meeting.duration}</span>
                                  </div>
                                  <div className="text-white/70 mt-0.5">
                                    {meeting.participants.length > 0 
                                      ? meeting.participants.slice(0, 2).join(", ") + (meeting.participants.length > 2 ? ` +${meeting.participants.length - 2}` : "")
                                      : "No participants"}
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center h-full opacity-0 hover:opacity-100 transition-opacity">
                                  <Plus className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <MeetingDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                meeting={editingMeeting}
                onSave={handleSaveMeeting}
                onDelete={editingMeeting ? handleDeleteMeeting : undefined}
              />
            </main>
          </div>
          
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MeetingPage;
