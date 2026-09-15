"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, Sun, Moon, Menu, ChevronDown, Check, LogOut, Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setTheme } from "@/store/slices/uiSlice";
import { logout } from "@/store/slices/authSlice";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/useMounted";

interface HeaderProps {
  onMenuClick: () => void;
}

const SEARCH_PAGES = [
  { title: "Dashboard Overview", href: "/", category: "Pages" },
  { title: "Orders Management", href: "/orders", category: "Pages" },
  { title: "Inventory & Stock Management", href: "/inventory", category: "Pages" },
  { title: "Activity Feed & Logs", href: "/activities", category: "Pages" },
  { title: "Notifications Center", href: "/notifications", category: "Pages" },
  { title: "Account & Dashboard Settings", href: "/settings", category: "Pages" }
];

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mounted = useMounted();
  
  // Theme state
  const theme = useSelector((state: RootState) => state.ui.theme);
  
  // Auth state
  const authUser = useSelector((state: RootState) => state.auth.user);
  const displayName = (mounted && authUser?.name) ? authUser.name : "Hitesh";
  const displayRole = (mounted && authUser?.role) ? authUser.role : "Administrator";
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  // Search state
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof SEARCH_PAGES>([]);

  // Notifications
  const { markNotificationRead, markAllNotificationsRead } = useNotifications();
  const notificationsState = useSelector((state: RootState) => state.notifications);
  
  // Dropdown visibility toggles
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Command + K keybinding to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Simple fuzzy filter for search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const filtered = SEARCH_PAGES.filter(page =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
  }, [searchQuery]);

  const handleToggleTheme = () => {
    dispatch(setTheme(theme === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleSelectSearch = (href: string) => {
    router.push(href);
    setSearchQuery("");
    setSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-20 h-[72px] bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center shrink-0 transition-colors duration-200">
      <div className="flex items-center w-full px-6 gap-4">
        {/* ── Left side (Hamburger & Search) ── */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Mobile Hamburger */}
          <button
            id="sidebar-toggle-btn"
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors flex-shrink-0 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </button>
          
          {/* Desktop hamburger */}
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors flex-shrink-0 hidden lg:flex"
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </button>

          {/* Global Search */}
          <div className="relative flex-1 max-w-[380px]">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              id="global-search-input"
              ref={searchInputRef}
              type="text"
              placeholder="Search pages (e.g. Orders)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className="w-full h-10 pl-10 pr-16 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-700 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 dark:focus:border-green-500 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200"
            />
            {/* Keyboard shortcut badge */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              <kbd className="text-[10px] font-medium text-gray-400 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded px-1.5 py-0.5 shadow-sm leading-none">
                ⌘K
              </kbd>
            </div>

            {/* Suggestions Overlay */}
            <AnimatePresence>
              {searchFocused && (searchQuery.trim() !== "") && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg z-30 overflow-hidden"
                >
                  <div className="px-3.5 py-2 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider border-b border-gray-100 dark:border-slate-700">
                    Search Results
                  </div>
                  {searchResults.length === 0 ? (
                    <div className="px-3.5 py-3 text-xs text-gray-500 dark:text-slate-400">
                      No matching pages found
                    </div>
                  ) : (
                    <ul className="list-none max-h-60 overflow-y-auto">
                      {searchResults.map((item, idx) => (
                        <li key={idx}>
                          <button
                            onMouseDown={() => handleSelectSearch(item.href)}
                            className="w-full text-left px-3.5 py-2.5 text-xs text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-750 transition-colors font-medium flex items-center justify-between"
                          >
                            <span>{item.title}</span>
                            <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                              {item.category}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Right side (Notifications, Theme Toggle, Profile) ── */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          
          {/* Notification Bell Dropdown Container */}
          <div className="relative">
            <button
              id="notification-btn"
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className={cn(
                "relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors",
                notifOpen && "bg-gray-100 dark:bg-slate-800"
              )}
              aria-label="Notifications"
            >
              <Bell size={18} />
              {notificationsState.unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 dark:bg-red-600 rounded-full ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Notifications Menu */}
            <AnimatePresence>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden flex flex-col"
                  >
                    <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-slate-700">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      {notificationsState.unreadCount > 0 && (
                        <button
                          onClick={() => markAllNotificationsRead()}
                          className="text-xs text-green-600 dark:text-green-400 hover:underline font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-slate-700/50">
                      {notificationsState.items.length === 0 ? (
                        <div className="px-4 py-8 text-center text-xs text-gray-400 dark:text-slate-500">
                          No notifications available
                        </div>
                      ) : (
                        notificationsState.items.map((item) => (
                          <div
                            key={item._id}
                            onClick={() => {
                              if (!item.read) markNotificationRead(item._id);
                            }}
                            className={cn(
                              "px-4 py-3 text-left transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-750 flex gap-3",
                              !item.read ? "bg-green-50/20 dark:bg-green-950/10" : ""
                            )}
                          >
                            <div className="flex-1">
                              <p className={cn("text-xs leading-snug", !item.read ? "font-semibold text-gray-900 dark:text-white" : "text-gray-600 dark:text-slate-400")}>
                                {item.title}
                              </p>
                              <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">
                                {item.message}
                              </p>
                            </div>
                            {!item.read && (
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 self-center flex-shrink-0" />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Theme toggle button */}
          <button
            id="theme-toggle-btn"
            onClick={handleToggleTheme}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Vertical divider */}
          <div className="w-px h-6 bg-gray-200 dark:bg-slate-800 mx-1.5" />

          {/* User profile dropdown container */}
          <div className="relative">
            <button
              id="user-profile-btn"
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              className="flex items-center gap-2 px-1.5 py-1 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              aria-label="User menu"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[11px] font-bold leading-none">{initials}</span>
              </div>
              
              {/* Name + role */}
              <div className="text-left hidden sm:block">
                <p className="text-[13px] font-semibold text-gray-900 dark:text-slate-200 leading-tight">
                  {displayName}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-tight">{displayRole}</p>
              </div>
              <ChevronDown size={13} className="text-gray-400 dark:text-slate-500 hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">{displayName}</p>
                      <p className="text-[10px] text-gray-500 dark:text-slate-400">{authUser?.email || "admin@grocery.com"}</p>
                    </div>
                    <ul className="list-none py-1">
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 font-medium flex items-center gap-2 transition-colors text-left"
                        >
                          <LogOut size={13} />
                          Log Out
                        </button>
                      </li>
                    </ul>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </header>
  );
}
