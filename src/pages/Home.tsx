import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import TuronCard from "../components/assets/turoncard.png"
import {
  Plus,
  MoreHorizontal,
  MessageSquare,
  GitBranch,
  Paperclip,
  GripVertical,
  Pencil,
  Trash2,
  Figma,
  ListTodo,
  CheckCircle2,
  Clock,
  Check,
  Upload,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/i18n";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  priority: "Low" | "Medium" | "High";
  date: string;
  attachments: number;
  comments: number;
  branches: number;
  avatar: string;
}

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  file?: File;
}

interface TodoSection {
  id: string;
  title: string;
  todos: TodoItem[];
}

interface Column {
  id: string;
  titleKey: string;
  color: string;
  tasks: Task[];
}

const initialColumns: Column[] = [
  {
    id: "my-tasks",
    titleKey: "myTasksColumn",
    color: "#a855f7",
    tasks: [
      {
        id: "1",
        title: "App wireframe design using figma",
        priority: "Medium",
        date: "01 Jan, 2023",
        attachments: 2,
        comments: 2,
        branches: 5,
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      },
      {
        id: "2",
        title: "Research webapp module",
        priority: "Low",
        date: "01 Jan, 2023",
        attachments: 2,
        comments: 2,
        branches: 2,
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      },
      {
        id: "3",
        title: "Research App design module",
        priority: "High",
        date: "01 Jan, 2023",
        attachments: 2,
        comments: 2,
        branches: 2,
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      },
      {
        id: "4",
        title: "Scope design for website",
        priority: "Medium",
        date: "01 Jan, 2023",
        attachments: 2,
        comments: 2,
        branches: 2,
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      },
      {
        id: "5",
        title: "App prototype",
        priority: "High",
        date: "01 Jan, 2023",
        attachments: 2,
        comments: 2,
        branches: 2,
        avatar:
          "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face",
      },
    ],
  },
  {
    id: "todo",
    titleKey: "toDo",
    color: "#facc15",
    tasks: [
      {
        id: "6",
        title: "App wireframe design using figma",
        priority: "Low",
        date: "01 Jan, 2023",
        attachments: 2,
        comments: 2,
        branches: 2,
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      },
      {
        id: "7",
        title: "App prototype",
        priority: "Low",
        date: "01 Jan, 2023",
        attachments: 2,
        comments: 2,
        branches: 2,
        avatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
      },
      {
        id: "8",
        title: "App Onboarding development",
        priority: "Medium",
        date: "01 Jan, 2023",
        attachments: 2,
        comments: 2,
        branches: 2,
        avatar:
          "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face",
      },
    ],
  },
  {
    id: "in-progress",
    titleKey: "inProgress",
    color: "#f97316",
    tasks: [
      {
        id: "9",
        title: "Research Website",
        priority: "High",
        date: "01 Jan, 2023",
        attachments: 2,
        comments: 2,
        branches: 2,
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      },
      {
        id: "10",
        title: "App wireframe design using figma",
        priority: "High",
        date: "01 Jan, 2023",
        attachments: 2,
        comments: 2,
        branches: 2,
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      },
      {
        id: "11",
        title: "Research App design module",
        priority: "Medium",
        date: "01 Jan, 2023",
        attachments: 2,
        comments: 2,
        branches: 2,
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      },
      {
        id: "12",
        title: "App prototype",
        priority: "Medium",
        date: "01 Jan, 2023",
        attachments: 2,
        comments: 2,
        branches: 2,
        avatar:
          "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face",
      },
    ],
  },
  {
    id: "done",
    titleKey: "done",
    color: "#22c55e",
    tasks: [
      {
        id: "13",
        title: "App Onboarding development",
        priority: "Medium",
        date: "01 Jan, 2023",
        attachments: 2,
        comments: 2,
        branches: 2,
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      },
      {
        id: "14",
        title: "App wireframe design using figma",
        priority: "High",
        date: "01 Jan, 2023",
        attachments: 2,
        comments: 2,
        branches: 2,
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      },
      {
        id: "15",
        title: "Research Website",
        priority: "Low",
        date: "01 Jan, 2023",
        attachments: 2,
        comments: 2,
        branches: 2,
        avatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
      },
      {
        id: "16",
        title: "Research Website",
        priority: "Medium",
        date: "01 Jan, 2023",
        attachments: 2,
        comments: 2,
        branches: 2,
        avatar:
          "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face",
      },
    ],
  },
];

const initialTodos: TodoItem[] = [
  { id: "t1", title: "Complete project proposal", completed: false },
  { id: "t2", title: "Review team submissions", completed: false },
  { id: "t3", title: "Update documentation", completed: true },
  { id: "t4", title: "Schedule team meeting", completed: false },
  { id: "t5", title: "Prepare presentation", completed: true },
];

const getCardBackground = (columnId: string, isDarkMode: boolean) => {
  if (isDarkMode) {
    return "hsl(217 33% 17%)"; // dark card color
  }
  switch (columnId) {
    case "my-tasks":
      return "#ECE5FC";
    case "todo":
      return "#FFF2E6";
    case "in-progress":
      return "#FAE1F4";
    case "done":
      return "#EBF8EF";
    default:
      return undefined;
  }
};

const teamMembers = [
  {
    id: 1,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    name: "John",
  },
  {
    id: 2,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    name: "Sarah",
  },
  {
    id: 3,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    name: "Mike",
  },
  {
    id: 4,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    name: "Alex",
  },
];

const Home = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditTodoDialogOpen, setIsEditTodoDialogOpen] = useState(false);
  const [addToColumn, setAddToColumn] = useState<string>("todo");
  const [newTask, setNewTask] = useState({
    title: "",
    priority: "Medium" as "Low" | "Medium" | "High",
  });
  const [editingTask, setEditingTask] = useState<{
    task: Task;
    columnId: string;
  } | null>(null);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [editTodoTitle, setEditTodoTitle] = useState("");
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [draggedTask, setDraggedTask] = useState<{
    task: Task;
    columnId: string;
  } | null>(null);
  const [todoFile, setTodoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const highlightedDates = [
    new Date(2025, 11, 15),
    new Date(2025, 11, 20),
    new Date(2025, 11, 25),
    new Date(2025, 11, 27),
    new Date(2025, 11, 30),
  ];

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "Low":
        return "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400";
      case "Medium":
        return "bg-amber-500/20 text-amber-600 dark:text-amber-400";
      case "High":
        return "bg-red-500/20 text-red-600 dark:text-red-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleAddTask = () => {
    if (!newTask.title.trim() || !addToColumn) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      priority: newTask.priority,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      attachments: 0,
      comments: 0,
      branches: 0,
      avatar:
        teamMembers[Math.floor(Math.random() * teamMembers.length)].avatar,
    };

    setColumns((prev) =>
      prev.map((col) =>
        col.id === addToColumn ? { ...col, tasks: [...col.tasks, task] } : col
      )
    );
    setNewTask({ title: "", priority: "Medium" });
    setIsAddDialogOpen(false);
    setAddToColumn("todo");
  };

  const handleEditTask = () => {
    if (!editingTask || !newTask.title.trim()) return;

    setColumns((prev) =>
      prev.map((col) =>
        col.id === editingTask.columnId
          ? {
              ...col,
              tasks: col.tasks.map((task) =>
                task.id === editingTask.task.id
                  ? {
                      ...task,
                      title: newTask.title,
                      priority: newTask.priority,
                    }
                  : task
              ),
            }
          : col
      )
    );
    setNewTask({ title: "", priority: "Medium" });
    setIsEditDialogOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string, columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) }
          : col
      )
    );
  };

  const openEditDialog = (task: Task, columnId: string) => {
    setEditingTask({ task, columnId });
    setNewTask({ title: task.title, priority: task.priority });
    setIsEditDialogOpen(true);
  };

  const openAddDialog = (columnId: string) => {
    setAddToColumn(columnId);
    setIsAddDialogOpen(true);
  };

  const handleAddTodo = () => {
    if (!newTodoTitle.trim()) return;
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      title: newTodoTitle,
      completed: false,
      file: todoFile || undefined,
    };
    setTodos((prev) => [...prev, newTodo]);
    setNewTodoTitle("");
    setTodoFile(null);
  };

  const toggleTodo = (todoId: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (todoId: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
  };

  const openEditTodoDialog = (todo: TodoItem) => {
    setEditingTodo(todo);
    setEditTodoTitle(todo.title);
    setIsEditTodoDialogOpen(true);
  };

  const handleEditTodo = () => {
    if (!editingTodo || !editTodoTitle.trim()) return;
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === editingTodo.id ? { ...todo, title: editTodoTitle } : todo
      )
    );
    setIsEditTodoDialogOpen(false);
    setEditingTodo(null);
    setEditTodoTitle("");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTodoFile(e.target.files[0]);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (
    e: React.DragEvent,
    task: Task,
    columnId: string
  ) => {
    setDraggedTask({ task, columnId });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.columnId === targetColumnId) {
      setDraggedTask(null);
      return;
    }

    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === draggedTask.columnId) {
          return {
            ...col,
            tasks: col.tasks.filter((t) => t.id !== draggedTask.task.id),
          };
        }
        if (col.id === targetColumnId) {
          return { ...col, tasks: [...col.tasks, draggedTask.task] };
        }
        return col;
      })
    );
    setDraggedTask(null);
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = todos.filter((t) => !t.completed).length;
  const inProgressColumn = columns.find((c) => c.id === "in-progress");
  const inProgressCount = inProgressColumn?.tasks.length || 0;
  const totalCount = todos.length;
  const completedPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const chartData = [
    { name: t("completed"), value: completedCount, fill: "#ffffff" },
    { name: t("pending"), value: pendingCount, fill: "rgba(255,255,255,0.4)" },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen relative">
        {/* Background Design Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <ListTodo className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {t("myTasks")}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {t("manageTasksForToday")}
                </p>
              </div>
            </div>
            <Button onClick={() => openAddDialog("todo")} className="gap-2">
              <Plus className="h-4 w-4" />
              {t("addTask")}
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex gap-6">
            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto">
              <div className="flex gap-4 pb-4 min-w-max">
                {columns.map((column) => (
                  <div
                    key={column.id}
                    className="w-[280px] flex-shrink-0 bg-white dark:bg-white/5 rounded-xl p-3"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, column.id)}
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: column.color }}
                        />
                        <span className="font-semibold text-foreground text-sm">
                          {t(column.titleKey as any)}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full text-xs"
                          style={{
                            backgroundColor: getCardBackground(
                              column.id,
                              isDarkMode
                            ),
                            color: column.color,
                          }}
                        >
                          {column.tasks.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => openAddDialog(column.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Tasks */}
                    <div className="flex flex-col gap-2">
                      {column.tasks.map((task) => (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) =>
                            handleDragStart(e, task, column.id)
                          }
                          className="rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing group"
                          style={{
                            backgroundColor: getCardBackground(
                              column.id,
                              isDarkMode
                            ),
                          }}
                        >
                          <div className="flex items-start gap-2 mb-3">
                            <GripVertical className="h-5 w-5 text-muted-foreground/50 mt-0.5 shrink-0 group-hover:text-muted-foreground transition-colors" />
                            <Figma
                              className="h-5 w-5 mt-0.5 shrink-0"
                              style={{ color: column.color }}
                            />
                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-tight flex-1">
                              {task.title}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-32">
                                <DropdownMenuItem
                                  onClick={() =>
                                    openEditDialog(task, column.id)
                                  }
                                  className="gap-2"
                                >
                                  <Pencil className="h-4 w-4" />
                                  {t("edit")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeleteTask(task.id, column.id)
                                  }
                                  className="gap-2 text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  {t("delete")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="mb-3 ml-7">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getPriorityStyles(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={task.avatar} />
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-3 text-muted-foreground text-xs">
                              <span>{task.date}</span>
                              <div className="flex items-center gap-1">
                                <Paperclip className="h-3 w-3" />
                                <span>
                                  {String(task.attachments).padStart(2, "0")}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                <span>
                                  {String(task.comments).padStart(2, "0")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add New Task Button */}
                      <Button
                        variant="ghost"
                        className="w-full border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary h-12 gap-2 text-muted-foreground hover:text-primary-foreground"
                        onClick={() => openAddDialog(column.id)}
                      >
                        <Plus className="h-4 w-4" />
                        {t("addNewTask")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-72 space-y-4 shrink-0">
              <div className="[perspective:1200px]">
  <div
    className="w-[370px] h-56 overflow-hidden cursor-pointer
               ml-[-40px] mt-[-10px] mb-[-20px]
               transition-all duration-500
               [transform-style:preserve-3d]
               hover:[transform:rotateX(-10deg)_rotateY(-20deg)_scale(1.05)]"
  >
    <img
      src={TuronCard}
      alt=""
      className="w-full h-full object-cover"
    />
  </div>
</div>
              {/* Todo List */}
              <div className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground text-sm">
                      {t("todos")}
                    </h3>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {todos.length} {t("items")}
                  </span>
                </div>

                <div className="flex gap-2 mb-3">
                  <Input
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                    placeholder={t("addNewTodo")}
                    className="flex-1 h-9 text-sm"
                    onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-9 w-9 shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={handleAddTodo}
                    className="h-9 w-9 shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {todoFile && (
                  <div className="flex items-center gap-2 mb-3 p-2 bg-muted rounded-lg text-xs">
                    <Paperclip className="h-3 w-3" />
                    <span className="truncate flex-1">{todoFile.name}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-5 w-5"
                      onClick={() => setTodoFile(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {todos.map((todo) => (
                    <div
                      key={todo.id}
                      draggable
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-grab active:cursor-grabbing transition-all group ${
                        todo.completed
                          ? "bg-primary/10"
                          : "bg-muted/50 hover:bg-muted"
                      }`}
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground/50 shrink-0 group-hover:text-muted-foreground transition-colors" />
                      <div
                        onClick={() => toggleTodo(todo.id)}
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
                          todo.completed
                            ? "bg-primary border-primary"
                            : "border-muted-foreground"
                        }`}
                      >
                        {todo.completed && (
                          <Check className="h-2.5 w-2.5 text-primary-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-xs block ${
                            todo.completed
                              ? "line-through text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {todo.title}
                        </span>
                        {todo.file && (
                          <span className="text-[10px] text-primary flex items-center gap-1">
                            <Paperclip className="h-2.5 w-2.5" />
                            {todo.file.name}
                          </span>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem
                            onClick={() => openEditTodoDialog(todo)}
                            className="gap-2"
                          >
                            <Pencil className="h-4 w-4" />
                            {t("edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="gap-2 text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            {t("delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Chart - Donut Style */}
              <div className="bg-gradient-to-b from-[#8e46ec] to-[#7136c9] rounded-[20px] border border-border p-4 relative overflow-hidden">
                <div className="absolute w-32 h-32 bg-white/20 rounded-full top-[-60px] right-[-50px]"></div>
                <h3 className="font-semibold text-primary-foreground text-sm mb-3">
                  {t("todoProgress")}
                </h3>
                <div className="h-44 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={4}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => (
                          <span className="text-xs text-primary-foreground/80">
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ marginBottom: 36 }}
                  >
                    <div className="text-center">
                      <span className="text-2xl font-bold text-primary-foreground">
                        {completedPercentage}%
                      </span>
                      <p className="text-xs text-primary-foreground/80">
                        {t("completed")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4 mt-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    <span className="text-primary-foreground/80">
                      {t("completed")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
                    <span className="text-primary-foreground/80">
                      {t("pending")}
                    </span>
                  </div>
                </div>
              </div>
             
            </div>
          </div>
        </div>

        {/* Add Task Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>{t("addTask")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>{t("taskTitle")}</Label>
                <Input
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder={t("enterTaskTitle")}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{t("priority")}</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value: "Low" | "Medium" | "High") =>
                    setNewTask((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">{t("low")}</SelectItem>
                    <SelectItem value="Medium">{t("medium")}</SelectItem>
                    <SelectItem value="High">{t("high")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("column")}</Label>
                <Select value={addToColumn} onValueChange={setAddToColumn}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={t("selectColumn")} />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map((col) => (
                      <SelectItem key={col.id} value={col.id}>
                        {t(col.titleKey as any)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddTask} className="w-full">
                {t("addTask")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Task Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>{t("editTask")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>{t("taskTitle")}</Label>
                <Input
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder={t("enterTaskTitle")}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{t("priority")}</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value: "Low" | "Medium" | "High") =>
                    setNewTask((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">{t("low")}</SelectItem>
                    <SelectItem value="Medium">{t("medium")}</SelectItem>
                    <SelectItem value="High">{t("high")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleEditTask} className="w-full">
                {t("saveChanges")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Todo Dialog */}
        <Dialog
          open={isEditTodoDialogOpen}
          onOpenChange={setIsEditTodoDialogOpen}
        >
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>{t("editTask")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>{t("taskTitle")}</Label>
                <Input
                  value={editTodoTitle}
                  onChange={(e) => setEditTodoTitle(e.target.value)}
                  placeholder={t("enterTaskTitle")}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleEditTodo} className="w-full">
                {t("saveChanges")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Home;
