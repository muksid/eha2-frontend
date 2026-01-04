import { useState, useEffect } from "react";
import { LucideIcon } from "lucide-react";

export interface DashboardMenuItem {
  label: string;
  path: string;
  icon: LucideIcon;
  count?: number;
}

const STORAGE_KEY = "dashboard-menu-items";

export const useDashboardItems = () => {
  const [dashboardItems, setDashboardItems] = useState<DashboardMenuItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setDashboardItems(parsed);
      } catch (e) {
        console.error("Failed to parse dashboard items", e);
      }
    }
  }, []);

  const addToDashboard = (item: DashboardMenuItem) => {
    const exists = dashboardItems.some((i) => i.path === item.path);
    if (!exists) {
      const newItems = [...dashboardItems, item];
      setDashboardItems(newItems);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems.map(i => ({
        label: i.label,
        path: i.path,
        count: i.count,
      }))));
    }
  };

  const removeFromDashboard = (path: string) => {
    const newItems = dashboardItems.filter((i) => i.path !== path);
    setDashboardItems(newItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems.map(i => ({
      label: i.label,
      path: i.path,
      count: i.count,
    }))));
  };

  return {
    dashboardItems,
    addToDashboard,
    removeFromDashboard,
  };
};