import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Meeting {
  id: string;
  title: string;
  participants: string[];
  duration: string;
  color: string;
}

interface MeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meeting?: Meeting | null;
  onSave: (meeting: Omit<Meeting, "id"> & { id?: string }) => void;
  onDelete?: () => void;
}

const colorOptions = [
  { value: "bg-emerald-600", label: "Green" },
  { value: "bg-blue-600", label: "Blue" },
  { value: "bg-orange-500", label: "Orange" },
  { value: "bg-purple-600", label: "Purple" },
  { value: "bg-gray-500", label: "Gray" },
];

const availableUsers = [
  "Shamsiddin K",
  "Alisher T",
  "Nodira S",
  "Jamshid R",
  "Malika U",
  "Bekzod N",
  "Dilshod M",
  "Sevara K",
];

export const MeetingDialog = ({ open, onOpenChange, meeting, onSave, onDelete }: MeetingDialogProps) => {
  const [title, setTitle] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [duration, setDuration] = useState("");
  const [color, setColor] = useState("bg-emerald-600");
  const [userSearch, setUserSearch] = useState("");

  useEffect(() => {
    if (meeting) {
      setTitle(meeting.title);
      setParticipants(meeting.participants || []);
      setDuration(meeting.duration);
      setColor(meeting.color);
    } else {
      setTitle("");
      setParticipants([]);
      setDuration("");
      setColor("bg-emerald-600");
    }
    setUserSearch("");
  }, [meeting, open]);

  const handleSave = () => {
    if (!title.trim() || !duration.trim()) return;
    
    onSave({
      id: meeting?.id,
      title: title.trim(),
      participants,
      duration: duration.trim(),
      color,
    });
    onOpenChange(false);
  };

  const addParticipant = (user: string) => {
    if (!participants.includes(user)) {
      setParticipants([...participants, user]);
    }
    setUserSearch("");
  };

  const removeParticipant = (user: string) => {
    setParticipants(participants.filter(p => p !== user));
  };

  const filteredUsers = availableUsers.filter(
    user => user.toLowerCase().includes(userSearch.toLowerCase()) && !participants.includes(user)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{meeting ? "Edit Meeting" : "New Meeting"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Team Standup"
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Participants</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users..."
                className="pl-9"
              />
            </div>
            {userSearch && filteredUsers.length > 0 && (
              <div className="bg-card border border-border rounded-lg max-h-32 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <button
                    key={user}
                    onClick={() => addParticipant(user)}
                    className="w-full text-left px-3 py-2 hover:bg-[#ECDAFD] hover:text-[#7302d5] text-sm transition-colors"
                  >
                    {user}
                  </button>
                ))}
              </div>
            )}
            {participants.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {participants.map((user) => (
                  <Badge key={user} variant="secondary" className="bg-[#ECDAFD] text-[#7302d5] gap-1">
                    {user}
                    <button onClick={() => removeParticipant(user)} className="hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 2h"
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Color</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${opt.value}`} />
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter className="flex gap-2">
          {meeting && onDelete && (
            <Button variant="destructive" onClick={onDelete} className="mr-auto">
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
