import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UiState {
  sidebarCollapsed: boolean;
  theme: "light" | "dark" | "system";
}

const getInitialTheme = (): "light" | "dark" | "system" => {
  // Always return deterministic value for SSR
  return "light";
};

const getInitialSidebar = (): boolean => {
  // Always return deterministic value for SSR
  return false;
};

const initialState: UiState = {
  sidebarCollapsed: getInitialSidebar(),
  theme: getInitialTheme(),
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      if (typeof window !== "undefined") {
        localStorage.setItem("sidebarCollapsed", String(state.sidebarCollapsed));
      }
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("sidebarCollapsed", String(action.payload));
      }
    },
    setTheme(state, action: PayloadAction<"light" | "dark" | "system">) {
      state.theme = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", action.payload);
        
        // Apply class to documentElement
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        
        if (action.payload === "system") {
          const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
          root.classList.add(systemTheme);
        } else {
          root.classList.add(action.payload);
        }
      }
    },
  },
});

export const { toggleSidebar, setSidebarCollapsed, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
