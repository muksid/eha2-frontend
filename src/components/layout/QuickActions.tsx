import { useState } from "react";
import {
  Sparkles,
  ChevronDown,
  Save,
  Wand2,
  Plane,
  Settings,
  RotateCcw,
  Sun,
  Scan,
  Plus,
  ListChecks,
  ChevronRight,
} from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";

import LogoBrand from "../assets/logobrand.svg";
import OnlyOffice from "../assets/onlyoffice.png";

// AI logos
import ChatGPTLogo from "../assets/chatgpt.jpg";
import NanoLogo from "../assets/nano.jpg";

/* ================= QUICK ACTIONS ================= */

function QuickActions() {
  const [collapsed, setCollapsed] = useState(false);
  const [aiDropdownOpen, setAiDropdownOpen] = useState(false);

  const aiTools = [
    { name: "ChatGPT", icon: ChatGPTLogo },
    { name: "Nano Banana Pro", icon: NanoLogo },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999]">
      <div className="flex items-center gap-2 bg-white/80 dark:bg-neutral-700/70 shadow-xl rounded-xl px-2 py-2 border border-border backdrop-blur">
        {/* ================= COLLAPSIBLE CONTENT ================= */}
        <div
          className={`flex items-center gap-2 transition-all duration-300 ${
            collapsed ? "w-0 opacity-0 scale-95" : "w-auto opacity-100 scale-100"
          }`}
        >
          {/* ================= TURON AI DROPDOWN ================= */}
          <div className="relative whitespace-nowrap">
            <Tooltip text="Turon AI">
              <button
                onClick={() => setAiDropdownOpen(!aiDropdownOpen)}
                className="flex items-center gap-2 bg-[#6D28D9] hover:bg-purple-700 text-white text-[13px] px-4 py-2 rounded-md font-medium"
              >
                <Sparkles className="h-4 w-4" />
                Turon AI
                <ChevronDown className="h-3 w-3" />
              </button>
            </Tooltip>

            {aiDropdownOpen && (
              <div className="absolute bottom-full mb-2 left-0 w-48 bg-white dark:bg-neutral-800 rounded-md shadow-lg border border-border py-2 z-50">
                {aiTools.map((tool) => (
                  <button
                    key={tool.name}
                    className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-md"
                  >
                    <img src={tool.icon} className="h-5 w-5 object-contain" />
                    <span className="text-sm text-neutral-800 dark:text-white">
                      {tool.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ================= ICON BUTTONS ================= */}
          <IconBtn icon={Save} tooltip="Save" />
          <IconBtn icon={Wand2} tooltip="Magic" />
          <IconBtn icon={Plane} tooltip="Deploy" />

          {/* Brand */}
          <IconBtn
            tooltip="Brand"
            bg="bg-[#229ed9]"
            icon={() => (
              <img src={LogoBrand} className="h-5 w-5 object-contain" />
            )}
          />

          {/* Telegram */}
          <IconBtn icon={FaTelegramPlane} tooltip="Telegram" />

          <IconBtn icon={Settings} tooltip="Settings" />
          <IconBtn icon={RotateCcw} tooltip="Reset" />

          <div className="w-px h-4 bg-border mx-1" />

          {/* ================= SPECIAL ICON COLORS ================= */}

          {/* Adjust – OnlyOffice */}
          <IconBtn
            tooltip="OnlyOffice"
            bg="bg-[#f6f6f6]"
            icon={() => (
              <img
                src={OnlyOffice}
                alt="OnlyOffice"
                className="h-5 w-5 object-contain"
              />
            )}
          />

          {/* Theme */}
          <IconBtn icon={Sun} tooltip="Theme" bg="bg-[#9BEE68]" />

          {/* Scan – WHITE in light mode */}
          <IconBtn
            icon={Scan}
            tooltip="Scan"
            bg="bg-[#fb2754]"
            iconClassName="text-white"
          />

          {/* Add – WHITE in light mode */}
          <IconBtn
            icon={Plus}
            tooltip="Add"
            bg="bg-purple-600"
            iconClassName="text-white"
          />

          <IconBtn icon={ListChecks} tooltip="Checklist" />
        </div>

        {/* ================= COLLAPSE TOGGLE ================= */}
        <Tooltip text={collapsed ? "Expand" : "Collapse"}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            <ChevronRight
              className={`h-5 w-5 transition-transform ${
                collapsed ? "rotate-0" : "rotate-180"
              }`}
            />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

export default QuickActions;

/* ================= ICON BUTTON ================= */

type IconBtnProps = {
  icon: React.ElementType | (() => JSX.Element);
  bg?: string;
  tooltip: string;
  iconClassName?: string;
};

function IconBtn({
  icon: Icon,
  bg,
  tooltip,
  iconClassName,
}: IconBtnProps) {
  return (
    <Tooltip text={tooltip}>
      <button
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          bg ?? "bg-neutral-100 dark:bg-[#20253B]/70"
        } hover:opacity-90 transition`}
      >
        {typeof Icon === "function" ? (
          <Icon />
        ) : (
          <Icon
            className={`h-5 w-5 ${
              iconClassName ?? "text-[#65758b] dark:text-white"
            }`}
          />
        )}
      </button>
    </Tooltip>
  );
}

/* ================= TOOLTIP ================= */

function Tooltip({
  children,
  text,
}: {
  children: React.ReactNode;
  text: string;
}) {
  return (
    <div className="relative group">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 rounded-md px-2 py-1 text-sm text-white bg-purple-700 opacity-0 group-hover:opacity-100 transition z-50">
        {text}
      </div>
    </div>
  );
}
