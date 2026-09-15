"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { toggleSidebar, setSidebarCollapsed, setTheme } from "@/store/slices/uiSlice";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const collapsed = useSelector((state: RootState) => state.ui.sidebarCollapsed);

  const [mounted, setMounted] = useState(false);

  // Close drawer when going desktop
  useEffect(() => {
    setMounted(true);
    
    // Sync sidebar state from local storage on mount
    const savedSidebar = localStorage.getItem("sidebarCollapsed");
    if (savedSidebar === "true") {
      dispatch(setSidebarCollapsed(true));
    }

    // Sync theme from local storage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") {
      dispatch(setTheme(savedTheme));
    }
    
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [dispatch]);

  const handleMenuToggle = () => {
    if (window.innerWidth >= 1024) {
      dispatch(toggleSidebar());
    } else {
      setMobileOpen((v) => !v);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-200"
      style={{
        "--sidebar-width": collapsed ? "80px" : "260px"
      } as React.CSSProperties}
    >
      {/* Fixed desktop sidebar */}
      <Sidebar />

      {/* Mobile sliding drawer */}
      <Sidebar
        isMobile
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main area — pushed right by sidebar width on desktop */}
      <div className="main-area transition-all duration-300">
        <Header onMenuClick={handleMenuToggle} />

        {/* Page content */}
        <main className="flex-1 px-6 py-6 xl:px-8 xl:py-7">
          {children}
        </main>
      </div>
    </div>
  );
}
