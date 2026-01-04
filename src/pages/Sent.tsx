import { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { 
  CheckSquare,
  FileCheck,
  FileSignature,
  Handshake,
  FilePlus,
  ClipboardSignature,
  Search,
  X,
  Calendar,
  Building2,
  FileText,
  Filter,
  ArrowLeft,
  Printer,
  Download,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DocumentData {
  id: number;
  number: string;
  title: string;
  sender: string;
  date: string;
  status: string;
}

const Sent = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedDocument, setSelectedDocument] = useState<DocumentData | null>(null);

  const statusTabs = [
    { value: "all", label: "Barchasi", color: "bg-[#6B21A8]/70 dark:bg-[#6B21A8]/40" },
    { value: "Yuborildi", label: "Yuborildi", color: "bg-green-500/70 dark:bg-green-500/40" },
    { value: "Ko'rib chiqilmoqda", label: "Ko'rib chiqilmoqda", color: "bg-yellow-500/70 dark:bg-yellow-500/40" },
    { value: "Tasdiqlandi", label: "Tasdiqlandi", color: "bg-blue-500/70 dark:bg-blue-500/40" },
    { value: "Imzolangan", label: "Imzolangan", color: "bg-orange-500/70 dark:bg-orange-500/40" },
  ];

  // Sample data for the table
  const tableData: DocumentData[] = [
    { id: 1, number: "DOC-2024-001", title: "Xodimlar ro'yxati", sender: "HR Bo'limi", date: "2024-01-15", status: "Yuborildi" },
    { id: 2, number: "DOC-2024-002", title: "Moliyaviy hisobot", sender: "Moliya Bo'limi", date: "2024-01-14", status: "Ko'rib chiqilmoqda" },
    { id: 3, number: "DOC-2024-003", title: "Shartnoma loyihasi", sender: "Yuridik Bo'lim", date: "2024-01-13", status: "Tasdiqlandi" },
    { id: 4, number: "DOC-2024-004", title: "Buyurtma ariza", sender: "Xarid Bo'limi", date: "2024-01-12", status: "Yuborildi" },
    { id: 5, number: "DOC-2024-005", title: "Mehnat shartnomasi", sender: "HR Bo'limi", date: "2024-01-11", status: "Imzolangan" },
  ];

  // Count items per status
  const getStatusCount = (status: string) => {
    if (status === "all") return tableData.length;
    return tableData.filter(row => row.status === status).length;
  };

  const getPageTitle = () => {
    if (currentPath.includes("/tasks")) return "Bajarish uchun";
    if (currentPath.includes("/hr-orders")) return "Tanishish uchun buyruq (HR)";
    if (currentPath.includes("/hr-xsb")) return "Tanishish uchun XSB (HR)";
    if (currentPath.includes("/agreements")) return "Kelishish uchun";
    if (currentPath.includes("/additional")) return "Qo'shimcha kelishuvlar (HR)";
    if (currentPath.includes("/protocols")) return "HR protokollari (imzo uchun)";
    return "Yuborilgan hujjatlar";
  };

  const getPageIcon = () => {
    if (currentPath.includes("/tasks")) return CheckSquare;
    if (currentPath.includes("/hr-orders")) return FileCheck;
    if (currentPath.includes("/hr-xsb")) return FileSignature;
    if (currentPath.includes("/agreements")) return Handshake;
    if (currentPath.includes("/additional")) return FilePlus;
    if (currentPath.includes("/protocols")) return ClipboardSignature;
    return CheckSquare;
  };

  const PageIcon = getPageIcon();

  const handleClear = () => {
    setSearchTerm("");
    setDepartment("");
    setDocumentType("");
    setActiveStatus("all");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const handleSearch = () => {
    console.log("Searching with filters:", { searchTerm, department, documentType, activeStatus, dateFrom, dateTo });
  };

  const handleArizaClick = (row: DocumentData) => {
    setSelectedDocument(row);
  };

  const handleBack = () => {
    setSelectedDocument(null);
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter data based on active status tab
  const filteredData = activeStatus === "all" 
    ? tableData 
    : tableData.filter(row => row.status === activeStatus);

  // Show document view if a document is selected
  if (selectedDocument) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between print:hidden">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Orqaga
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2" onClick={handlePrint}>
                <Printer className="h-4 w-4" />
                Chop etish
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Yuklab olish
              </Button>
            </div>
          </div>

          {/* A4 Document Container */}
          <div className="flex justify-center">
            <div 
              className="bg-white shadow-2xl border border-gray-200"
              style={{
                width: "210mm",
                minHeight: "297mm",
                padding: "20mm",
              }}
            >
              {/* Document Header */}
              <div className="text-center mb-8">
                <h1 className="text-xl font-bold text-gray-900 mb-2">O'ZBEKISTON RESPUBLIKASI</h1>
                <h2 className="text-lg font-semibold text-gray-800">ARIZA</h2>
              </div>

              {/* Document Info */}
              <div className="flex justify-between mb-8 text-sm text-gray-700">
                <div>
                  <p><strong>Hujjat raqami:</strong> {selectedDocument.number}</p>
                  <p><strong>Sana:</strong> {selectedDocument.date}</p>
                </div>
                <div className="text-right">
                  <p><strong>Bo'lim:</strong> {selectedDocument.sender}</p>
                </div>
              </div>

              {/* Document Title */}
              <div className="text-center mb-8">
                <h3 className="text-lg font-semibold text-gray-900 underline">{selectedDocument.title}</h3>
              </div>

              {/* Document Body */}
              <div className="space-y-4 text-gray-800 leading-relaxed">
                <p className="text-justify indent-8">
                  Hurmatli rahbariyat! Ushbu ariza orqali quyidagi masala bo'yicha murojaat qilmoqchiman. 
                  Ariza mazmunida ko'rsatilgan barcha ma'lumotlar to'g'ri va haqiqiy ekanligini tasdiqlayman.
                </p>
                
                <p className="text-justify indent-8">
                  Tashkilotimiz faoliyatini yaxshilash maqsadida, quyidagi takliflarni ko'rib chiqishingizni 
                  so'rayman. Ushbu takliflar asosida tegishli qarorlar qabul qilinishini umid qilaman.
                </p>

                <p className="text-justify indent-8">
                  Arizada keltirilgan barcha ma'lumotlar hujjatlar bilan tasdiqlangan bo'lib, zarur 
                  hollarda qo'shimcha ma'lumotlar taqdim etishga tayyorman.
                </p>

                <div className="mt-12">
                  <p className="font-medium">Qo'shimcha ma'lumotlar:</p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Ariza yuborilgan sana: {selectedDocument.date}</li>
                    <li>Ariza holati: {selectedDocument.status}</li>
                    <li>Mas'ul bo'lim: {selectedDocument.sender}</li>
                  </ul>
                </div>
              </div>

              {/* Signature Section */}
              <div className="mt-16 flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-600 mb-8">Imzo: ____________________</p>
                  <p className="text-sm text-gray-600">F.I.O: ____________________</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-8">Sana: {selectedDocument.date}</p>
                  <p className="text-sm text-gray-600">Muhr joyi</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-16 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
                <p>Ushbu hujjat elektron tizim orqali yaratilgan</p>
                <p>Hujjat raqami: {selectedDocument.number}</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6B21A8] to-[#4C1D95] flex items-center justify-center">
            <PageIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{getPageTitle()}</h1>
            <p className="text-sm text-muted-foreground">Yuborilgan hujjatlar ro'yxati</p>
          </div>
        </div>


        {/* Filters Section */}
        <div className="p-4 rounded-lg bg-white dark:bg-gray-800/50 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-[#6B21A8] dark:text-[#a855f7]" />
              <span className="font-medium text-foreground">Filtrlar</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border border-dashed border-[#6B21A8]/50 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>

            {/* Department Select */}
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-full border border-dashed border-[#6B21A8]/50 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                <Building2 className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                <SelectValue placeholder="Bo'lim" className="text-gray-500" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                <SelectItem value="hr">HR Bo'limi</SelectItem>
                <SelectItem value="finance">Moliya Bo'limi</SelectItem>
                <SelectItem value="legal">Yuridik Bo'lim</SelectItem>
                <SelectItem value="procurement">Xarid Bo'limi</SelectItem>
              </SelectContent>
            </Select>

            {/* Document Type Select */}
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger className="w-full border border-dashed border-[#6B21A8]/50 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                <FileText className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                <SelectValue placeholder="Hujjat turi" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                <SelectItem value="order">Buyruq</SelectItem>
                <SelectItem value="contract">Shartnoma</SelectItem>
                <SelectItem value="report">Hisobot</SelectItem>
                <SelectItem value="letter">Xat</SelectItem>
              </SelectContent>
            </Select>

            {/* Date From */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal border border-dashed border-[#6B21A8]/50 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:text-white hover:bg-[#6B21A8]"
                >
                  <Calendar className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  {dateFrom ? format(dateFrom, "dd.MM.yyyy") : <span className="text-gray-500 dark:text-gray-400">Sanadan</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-700" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            {/* Date To */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal border border-dashed border-[#6B21A8]/50 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:text-white hover:bg-[#6B21A8]"
                >
                  <Calendar className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  {dateTo ? format(dateTo, "dd.MM.yyyy") : <span className="text-gray-500 dark:text-gray-400">Sanagacha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-700" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-4">
            <Button 
              onClick={handleSearch}
              className="bg-[#8856F4] hover:bg-[#7040D4] text-white gap-2 rounded-md"
            >
              <Search className="h-4 w-4" />
              Qidirish
            </Button>
            <Button 
              onClick={handleClear}
              className="gap-2 bg-[#FB2654] hover:bg-[#E01E48] text-white rounded-md"
            >
              <X className="h-4 w-4" />
              Tozalash
            </Button>
          </div>
        </div>

        {/* Status Tabs - Above Table */}
        <div className="flex items-center gap-6 flex-wrap mt-2">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveStatus(tab.value)}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                activeStatus === tab.value 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              <span className={`${tab.color} text-white text-xs px-2 py-0.5 rounded-full min-w-[24px] text-center`}>
                {getStatusCount(tab.value)}
              </span>
            </button>
          ))}
        </div>

        {/* Table Section */}
        <div className="rounded-lg overflow-hidden border border-border dark:border-gray-500 m-0">
          <Table>
            <TableHeader className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED]">
              <TableRow className="border-b border-white/20 hover:bg-transparent">
                <TableHead className="font-semibold text-white border-r border-white/20">№</TableHead>
                <TableHead className="font-semibold text-white border-r border-white/20">Hujjat raqami</TableHead>
                <TableHead className="font-semibold text-white border-r border-white/20">Sarlavha</TableHead>
                <TableHead className="font-semibold text-white border-r border-white/20">Yuboruvchi</TableHead>
                <TableHead className="font-semibold text-white border-r border-white/20">Sana</TableHead>
                <TableHead className="font-semibold text-white border-r border-white/20">Holat</TableHead>
                <TableHead className="font-semibold text-white">Arizalar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white dark:bg-card">
              {filteredData.map((row, index) => (
                <TableRow 
                  key={row.id} 
                  className="border-b border-border dark:border-gray-500 hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium border-r border-border dark:border-gray-500">{index + 1}</TableCell>
                  <TableCell className="border-r border-border dark:border-gray-500">{row.number}</TableCell>
                  <TableCell className="border-r border-border dark:border-gray-500">{row.title}</TableCell>
                  <TableCell className="border-r border-border dark:border-gray-500">{row.sender}</TableCell>
                  <TableCell className="border-r border-border dark:border-gray-500">{row.date}</TableCell>
                  <TableCell className="border-r border-border dark:border-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row.status === "Yuborildi" ? "bg-blue-500/20 text-blue-600 dark:text-blue-300" :
                      row.status === "Ko'rib chiqilmoqda" ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-300" :
                      row.status === "Tasdiqlandi" ? "bg-green-500/20 text-green-600 dark:text-green-300" :
                      "bg-purple-500/20 text-purple-600 dark:text-purple-300"
                    }`}>
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleArizaClick(row)}
                      className="text-[#6B21A8] hover:text-[#5B21B6] hover:bg-[#6B21A8]/10 dark:text-[#a855f7]"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Ko'rish
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Sent;
