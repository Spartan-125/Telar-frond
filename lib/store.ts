"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "./auth"

import type { ChartData } from "./chart-data"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  chartType?: "bar" | "pie" | "line" | "area" | "radar"
  chartData?: ChartData
}

interface AppState {
  // Auth
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void

  // Theme
  theme: "dark" | "light"
  toggleTheme: () => void

  // Sidebar
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void

  // Current page
  currentPage: string
  setCurrentPage: (page: string) => void

  // Inventory data
  inventoryData: any[]
  setInventoryData: (data: any[]) => void

  // Inventory filter
  inventoryFilter: string
  setInventoryFilter: (filter: string) => void

  aiChatOpen: boolean
  setAiChatOpen: (open: boolean) => void
  chatMessages: ChatMessage[]
  addChatMessage: (message: ChatMessage) => void
  clearChat: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),

      // Theme
      theme: "dark",
      toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),

      // Sidebar
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Current page
      currentPage: "dashboard",
      setCurrentPage: (page) => set({ currentPage: page }),

      // Inventory
      inventoryData: [],
      setInventoryData: (data) => set({ inventoryData: data }),

      // Inventory filter
      inventoryFilter: "",
      setInventoryFilter: (filter) => set({ inventoryFilter: filter }),

      aiChatOpen: false,
      setAiChatOpen: (open) => set({ aiChatOpen: open }),
      chatMessages: [],
      addChatMessage: (message) => set((state) => ({ chatMessages: [...state.chatMessages, message] })),
      clearChat: () => set({ chatMessages: [] }),
    }),
    {
      name: "fashion-inventory-store",
    },
  ),
)
