"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { RootState } from "@/store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not authenticated and not on login page, redirect to login
    if (!isAuthenticated && pathname !== "/login") {
      router.push("/login");
    }
    // If already authenticated and trying to access login, redirect to dashboard
    else if (isAuthenticated && pathname === "/login") {
      router.push("/");
    }
  }, [isAuthenticated, loading, pathname, router]);

  return <>{children}</>;
}
