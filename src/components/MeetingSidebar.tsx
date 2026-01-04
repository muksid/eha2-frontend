import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Filter, CalendarDays, Search, X, UserPlus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const availableUsers = [
  { id: "1", name: "Aziz Karimov", avatar: "AK", color: "bg-emerald-500" },
  { id: "2", name: "Dilnoza Rahimova", avatar: "DR", color: "bg-blue-500" },
  { id: "3", name: "Bobur Aliyev", avatar: "BA", color: "bg-orange-500" },
  { id: "4", name: "Malika Tosheva", avatar: "MT", color: "bg-purple-500" },
  { id: "5", name: "Jasur Nazarov", avatar: "JN", color: "bg-pink-500" },
  { id: "6", name: "Sardor Yusupov", avatar: "SY", color: "bg-cyan-500" },
  { id: "7", name: "Nodira Hamidova", avatar: "NH", color: "bg-amber-500" },
];

const meetingTypes = [
  { id: "standup", label: "Kunlik yig'ilish", color: "bg-emerald-600" },
  { id: "client", label: "Mijoz uchrashuvi", color: "bg-blue-600" },
  { id: "review", label: "Loyiha ko'rib chiqish", color: "bg-orange-500" },
  { id: "training", label: "Trening", color: "bg-purple-600" },
  { id: "planning", label: "Rejalashtirish", color: "bg-pink-600" },
];

export const MeetingSidebar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [roomFilter, setRoomFilter] = useState<string>("all");
  const [userSearch, setUserSearch] = useState("");
  const [addedUsers, setAddedUsers] = useState<string[]>([]);

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleType = (typeId: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const addUser = (userId: string) => {
    if (!addedUsers.includes(userId)) {
      setAddedUsers(prev => [...prev, userId]);
    }
    setUserSearch("");
  };

  const removeAddedUser = (userId: string) => {
    setAddedUsers(prev => prev.filter(id => id !== userId));
  };

  const filteredUsers = availableUsers.filter(user => 
    user.name.toLowerCase().includes(userSearch.toLowerCase()) &&
    !addedUsers.includes(user.id)
  );

  return (
    <aside className="w-[275px] bg-card border-r border-border overflow-y-auto sidebar-scrollbar p-4 space-y-6">
      {/* Date Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays className="h-4 w-4 text-[#7302d5]" />
          <h3 className="text-sm font-semibold text-foreground">Sana</h3>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Sanani tanlang</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Add Users Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <UserPlus className="h-4 w-4 text-[#7302d5]" />
          <h3 className="text-sm font-semibold text-foreground">Ishtirokchi qo'shish</h3>
        </div>
        
        {/* Added Users */}
        {addedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {addedUsers.map(userId => {
              const user = availableUsers.find(u => u.id === userId);
              return user && (
                <Badge 
                  key={userId} 
                  variant="secondary" 
                  className="flex items-center gap-1 pr-1"
                >
                  <div className={`w-5 h-5 rounded-full ${user.color} flex items-center justify-center text-white text-[10px] font-medium`}>
                    {user.avatar}
                  </div>
                  <span className="text-xs">{user.name}</span>
                  <button 
                    onClick={() => removeAddedUser(userId)}
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        )}
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Foydalanuvchi qidirish..." 
            className="pl-10"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />
        </div>
        
        {/* User Suggestions */}
        {userSearch && filteredUsers.length > 0 && (
          <div className="mt-2 border border-border rounded-lg bg-card shadow-lg max-h-40 overflow-y-auto">
            {filteredUsers.map(user => (
              <button
                key={user.id}
                onClick={() => addUser(user.id)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#ECDAFD] hover:text-[#7302d5] transition-colors text-left"
              >
                <div className={`w-7 h-7 rounded-full ${user.color} flex items-center justify-center text-white text-xs font-medium`}>
                  {user.avatar}
                </div>
                <span className="text-sm">{user.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Users Filter */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-[#7302d5]" />
          <h3 className="text-sm font-semibold text-foreground">Ishtirokchilar (filtr)</h3>
        </div>
        <div className="space-y-3">
          {availableUsers.slice(0, 5).map(user => (
            <div key={user.id} className="flex items-center gap-3">
              <Checkbox 
                id={`filter-${user.id}`}
                checked={selectedUsers.includes(user.id)}
                onCheckedChange={() => toggleUser(user.id)}
              />
              <div className={`w-7 h-7 rounded-full ${user.color} flex items-center justify-center text-white text-xs font-medium`}>
                {user.avatar}
              </div>
              <Label htmlFor={`filter-${user.id}`} className="text-sm cursor-pointer">{user.name}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Meeting Types Filter */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-[#7302d5]" />
          <h3 className="text-sm font-semibold text-foreground">Uchrashuv turi</h3>
        </div>
        <div className="space-y-2">
          {meetingTypes.map(type => (
            <div key={type.id} className="flex items-center gap-3">
              <Checkbox 
                id={type.id}
                checked={selectedTypes.includes(type.id)}
                onCheckedChange={() => toggleType(type.id)}
              />
              <Badge className={`${type.color} text-white text-xs`}>{type.label}</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Room Filter */}
      <div>
        <Label className="text-sm font-semibold text-foreground mb-2 block">Xona</Label>
        <Select value={roomFilter} onValueChange={setRoomFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Xonani tanlang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barcha xonalar</SelectItem>
            <SelectItem value="room-a1">Room A1</SelectItem>
            <SelectItem value="room-b2">Room B2</SelectItem>
            <SelectItem value="room-c3">Room C3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {(selectedUsers.length > 0 || selectedTypes.length > 0) && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Faol filtrlar</h3>
          <div className="flex flex-wrap gap-1">
            {selectedUsers.map(userId => {
              const user = availableUsers.find(u => u.id === userId);
              return user && (
                <Badge key={userId} variant="secondary" className="text-xs">
                  {user.name}
                </Badge>
              );
            })}
            {selectedTypes.map(typeId => {
              const type = meetingTypes.find(t => t.id === typeId);
              return type && (
                <Badge key={typeId} className={`${type.color} text-white text-xs`}>
                  {type.label}
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
};