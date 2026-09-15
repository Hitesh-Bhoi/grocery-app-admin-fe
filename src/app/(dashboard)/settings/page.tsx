"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setTheme } from "@/store/slices/uiSlice";
import { Sun, Moon, Laptop, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.ui.theme);
  const user = useSelector((state: RootState) => state.auth.user);

  const themeOptions = [
    { value: "light", label: "Light Mode", icon: Sun },
    { value: "dark", label: "Dark Mode", icon: Moon },
    { value: "system", label: "System Default", icon: Laptop },
  ] as const;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
          Dashboard Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400 font-normal">
          Customize your dashboard preferences, theme modes, and view user role scopes.
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Theme Preferences */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white mb-4">Appearance Theme</h2>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.value;

              return (
                <button
                  key={opt.value}
                  onClick={() => dispatch(setTheme(opt.value))}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 border rounded-2xl text-xs font-semibold cursor-pointer transition-all duration-200 select-none",
                    isSelected
                      ? "bg-green-50/50 dark:bg-green-950/20 border-green-500 text-green-700 dark:text-green-400"
                      : "border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-400"
                  )}
                >
                  <Icon size={20} className="mb-2" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white mb-4">Logged In Profile</h2>
          
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800/40 rounded-2xl">
            <div className="w-12 h-12 bg-green-600 dark:bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
              {user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "HP"}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">{user?.name || "Hitesh"}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user?.email || "admin@grocery.com"}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-150 dark:border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 dark:text-slate-500 font-medium">User ID</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{user?.id || "648f572a15c32810a905bbff"}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 dark:text-slate-500 font-medium">Authorization Scope</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 rounded-full font-bold">
                <ShieldCheck size={12} />
                {user?.role || "Admin"}
              </span>
            </div>
          </div>
        </div>

        {/* Roles Scope description */}
        <div className="p-4 bg-blue-50/50 dark:bg-slate-900/30 border border-blue-150 dark:border-slate-800 rounded-2xl">
          <h3 className="text-xs font-bold text-blue-900 dark:text-blue-400">Role-Based Scope Levels</h3>
          <p className="text-xs text-blue-800 dark:text-slate-400 mt-1 leading-relaxed">
            - <strong>Admin:</strong> Complete CRUD on inventory, orders status updates, database seeding, audit logs view.<br />
            - <strong>Manager:</strong> Read metrics, search orders, and increment/decrement inventory stocks.<br />
            - <strong>Staff:</strong> View order logs and modify status badges.
          </p>
        </div>
      </div>
    </>
  );
}
