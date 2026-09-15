"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/slices/authSlice";
import { mockStore } from "@/services/mockStore";
import { motion } from "framer-motion";
import { KeyRound, Mail, Loader2, ShieldCheck, UserCheck, Users } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@grocery.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLoginWith = async (loginEmail: string, loginPass: string) => {
    setError("");
    setLoading(true);

    try {
      // Simulate brief validation delay for smooth UI feedback
      await new Promise((resolve) => setTimeout(resolve, 250));
      const data = mockStore.login(loginEmail, loginPass);
      dispatch(loginSuccess({ user: data.user, token: data.token }));
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLoginWith(email, password);
  };

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    await handleLoginWith(demoEmail, demoPass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-200">
      {/* Background design elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl relative z-10 transition-colors duration-200"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-950/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 dark:text-green-400 font-bold text-xl">A</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Sign in to manage your grocery store
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-medium rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@grocery.com"
                className="w-full h-11 pl-11 pr-4 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 dark:focus:border-green-500 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-11 pr-4 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 dark:focus:border-green-500 transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Quick Demo Login Presets */}
        <div className="mt-6 p-4 bg-green-50/50 dark:bg-slate-800/50 border border-green-100 dark:border-slate-700 rounded-2xl text-center">
          <p className="text-xs font-semibold text-green-800 dark:text-green-400 mb-2.5">
            Quick One-Click Demo Sign-in
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin("admin@grocery.com", "admin123")}
              className="px-2 py-2 bg-white dark:bg-slate-850 hover:bg-green-100/50 dark:hover:bg-green-950/30 border border-green-200 dark:border-slate-700 rounded-xl text-[11px] font-semibold text-green-800 dark:text-green-300 transition-all cursor-pointer flex flex-col items-center gap-1 shadow-sm disabled:opacity-50"
            >
              <ShieldCheck size={14} className="text-green-600 dark:text-green-400" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin("manager@grocery.com", "manager123")}
              className="px-2 py-2 bg-white dark:bg-slate-850 hover:bg-blue-100/50 dark:hover:bg-blue-950/30 border border-blue-200 dark:border-slate-700 rounded-xl text-[11px] font-semibold text-blue-800 dark:text-blue-300 transition-all cursor-pointer flex flex-col items-center gap-1 shadow-sm disabled:opacity-50"
            >
              <UserCheck size={14} className="text-blue-600 dark:text-blue-400" />
              <span>Manager</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin("staff@grocery.com", "staff123")}
              className="px-2 py-2 bg-white dark:bg-slate-850 hover:bg-purple-100/50 dark:hover:bg-purple-950/30 border border-purple-200 dark:border-slate-700 rounded-xl text-[11px] font-semibold text-purple-800 dark:text-purple-300 transition-all cursor-pointer flex flex-col items-center gap-1 shadow-sm disabled:opacity-50"
            >
              <Users size={14} className="text-purple-600 dark:text-purple-400" />
              <span>Staff</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
