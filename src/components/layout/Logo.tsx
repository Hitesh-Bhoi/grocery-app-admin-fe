import React from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "w-9 h-9", showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      {!showText ? (
        <div className="w-9 h-9 rounded-xl bg-green-600 dark:bg-green-500 flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0">
          A
        </div>
      ) : (
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-green-600 dark:bg-green-500 flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0">
            A
          </div>
          <span className="text-[26px] font-bold tracking-tight leading-none text-slate-800 dark:text-white">
            <span className="dark:text-green-300">Admin</span>
            <span className="text-[#34A853]">panel</span>
          </span>
        </div>
      )}
    </div>
  );
}
