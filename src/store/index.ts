import { create } from 'zustand'
import { getDefaultBook } from '@/pages/index/service'

interface Book {
  id: number;
  name: string;
}

interface AppState {
  defaultBook: Book | null;
  setDefaultBook: (book: Book) => void;
  fetchDefaultBook: () => Promise<void>;
  isDefaultBookLoaded: boolean;
}

export const useAppStore = create<AppState>((set) => ({
  defaultBook: null,
  isDefaultBookLoaded: false,
  setDefaultBook: (book) => set({ defaultBook: book }),
  fetchDefaultBook: async () => {
    try {
      const book = await getDefaultBook();
      set({ defaultBook: book, isDefaultBookLoaded: true });
    } catch (error) {
      console.error('获取默认账本失败:', error);
    }
  }
}))