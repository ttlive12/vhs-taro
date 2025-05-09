import { create } from "zustand";

// 定义tabBar状态的接口
interface TabBarState {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

// 创建tabBar状态管理
export const useTabBarStore = create<TabBarState>((set) => ({
  // 当前选中的tab索引
  currentIndex: 0,

  // 设置当前选中的tab索引
  setCurrentIndex: (index: number) => set({ currentIndex: index }),
}));
