import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Taro from "@tarojs/taro";

export enum RankType {
  COMBINED = "1",
  WINRATE = "2",
}

interface RankTypeState {
  rankType: RankType;
  setRankType: (rankType: RankType) => void;
}

// 创建一个存储排行榜类型的store
export const useRankTypeStore = create<RankTypeState>()(
  persist(
    (set) => ({
      rankType: RankType.COMBINED, // 默认为综合排行
      setRankType: (rankType) => set({ rankType }),
    }),
    {
      name: "rank-type-storage",
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const value = Taro.getStorageSync(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          Taro.setStorageSync(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          Taro.removeStorageSync(name);
        },
      })),
    }
  )
);
