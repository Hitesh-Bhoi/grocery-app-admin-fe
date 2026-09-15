"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@public/adminpanel-logo.png"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Activity,
  Bell,
  Settings,
  X,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useMounted } from "@/hooks/useMounted";

// ─── Sidebar Navigation config ───────────────────────────────────────────────
const navItems = [
  { id: "dashboard", label: "Dashboard", href: "/", icon: LayoutDashboard },
  { id: "orders", label: "Orders", href: "/orders", icon: ShoppingCart },
  { id: "inventory", label: "Inventory", href: "/inventory", icon: Package },
  { id: "activities", label: "Activities", href: "/activities", icon: Activity },
  { id: "notifications", label: "Notifications", href: "/notifications", icon: Bell },
  { id: "settings", label: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

// ─── Sidebar Inner Content ────────────────────────────────────────────────────
function SidebarContent({
  isMobile = false,
  onClose,
}: {
  isMobile?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const collapsed = useSelector((state: RootState) => state.ui.sidebarCollapsed);
  const user = useSelector((state: RootState) => state.auth.user);
  const mounted = useMounted();
  
  const showText = isMobile || !collapsed;
  const displayName = (mounted && user?.name) ? user.name : "Hitesh";
  const displayRole = (mounted && user?.role) ? user.role : "Administrator";
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transition-colors duration-200">
      {/* ── Logo ── */}
      <div 
        className={cn(
          "flex items-center h-[72px] border-b border-gray-100 dark:border-slate-800 flex-shrink-0 transition-all duration-300",
          showText ? "px-5 justify-between" : "px-0 justify-center"
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={isMobile ? onClose : undefined}
        >
          <Logo showText={showText} />
        </Link>

        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 dark:text-gray-500 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="list-none space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={isMobile ? onClose : undefined}
                  className="block"
                  title={!showText ? item.label : undefined}
                >
                  <motion.div
                    whileHover={{ x: (isActive || !showText) ? 0 : 3 }}
                    transition={{ duration: 0.15 }}
                    className={cn(
                      "flex items-center rounded-xl text-sm font-medium transition-colors duration-150",
                      isActive
                        ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                        : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white",
                      showText ? "gap-3 px-3 py-2.5" : "justify-center p-3"
                    )}
                  >
                    <Icon
                      size={18}
                      className={cn(
                        "flex-shrink-0",
                        isActive ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-slate-500"
                      )}
                    />
                    {showText && <span className="flex-1 truncate">{item.label}</span>}
                    {isActive && showText && (
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                    )}
                  </motion.div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Bottom Profile ── */}
      <div className="px-3 py-4 border-t border-gray-100 dark:border-slate-800 flex-shrink-0">
        <button 
          className={cn(
            "flex items-center w-full rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-left",
            showText ? "gap-3 px-3 py-2.5" : "justify-center p-2"
          )}
          title={!showText ? `${displayName} (${displayRole})` : undefined}
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gray-800 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[11px] font-bold leading-none">{initials}</span>
          </div>
          
          {showText && (
            <>
              {/* Name + Role */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-200 leading-tight truncate">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400 leading-tight truncate">
                  {displayRole}
                </p>
              </div>
              {/* Dropdown chevron */}
              <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Sidebar Component ────────────────────────────────────────────────────────
export function Sidebar({ isMobile = false, isOpen = false, onClose }: SidebarProps) {
  const collapsed = useSelector((state: RootState) => state.ui.sidebarCollapsed);
  const sidebarWidthClass = collapsed ? "w-[80px]" : "w-[260px]";

  /* Desktop: fixed sidebar */
  if (!isMobile) {
    return (
      <aside className={`fixed top-0 left-0 h-full ${sidebarWidthClass} z-30 hidden lg:block transition-all duration-300`}>
        <SidebarContent />
      </aside>
    );
  }

  /* Mobile: sliding drawer */
  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed top-0 left-0 h-full w-[260px] z-50 lg:hidden"
          >
            <SidebarContent isMobile onClose={onClose} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
