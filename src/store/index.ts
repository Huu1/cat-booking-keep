import { create } from "zustand";
import { getCurrentUser, getDefaultBook } from "@/pages/index/service";

interface Book {
  id: number;
  name: string;
}

// 添加用户类型定义
export interface User {
  id: number;
  username: string;
}

// 扩展 AppState 接口
interface AppState {
  defaultBook: Book | null;
  setDefaultBook: (book: Book) => void;
  fetchDefaultBook: () => Promise<void>;
  getUserInfo: () => Promise<void>;
  logout: () => void;
  isDefaultBookLoaded: boolean;
  user: User | null;
}

export const useAppStore = create<AppState>((set) => ({
  defaultBook: null,
  isDefaultBookLoaded: false,
  user: null,
  setDefaultBook: (book) => set({ defaultBook: book }),
  logout: () => set({ user:null }),
  fetchDefaultBook: async () => {
    try {
      const book = await getDefaultBook();
      set({ defaultBook: book, isDefaultBookLoaded: true });
    } catch (error) {
      console.error("获取默认账本失败:", error);
    }
  },
  getUserInfo: async () => {
    try {
      const user = await getCurrentUser();
      set({ user });
      // 获取用户信息成功后，再获取默认账本
      if (user) {
        const book = await getDefaultBook();
        set({ defaultBook: book, isDefaultBookLoaded: true });
      }
    } catch (error) {
      console.error("获取用户信息失败:", error);
    }
  },
}));
