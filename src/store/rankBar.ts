import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Taro from "@tarojs/taro";
import { Rank } from "@/constants";
import { legend, diamond1, diamond5 } from "@/assets/image";

// 定义数据类型接口
export interface RankType {
  id: Rank;
  name: string;
  url: string;
}

// 默认的分类数据
export const dataTypes: RankType[] = [
  {
    id: Rank.TOP_LEGEND,
    name: "传说Top1000",
    url: legend,
  },
  {
    id: Rank.DIAMOND_4TO1,
    name: "钻石4-1",
    url: diamond1,
  },
  {
    id: Rank.TOP_5K,
    name: "传说Top5000",
    url: legend,
  },
  {
    id: Rank.DIAMOND_TO_LEGEND,
    name: "钻石-传说",
    url: diamond5,
  },
];

interface RankBarState {
  currentType: Rank;
  sortedDataTypes: RankType[];
  setCurrentType: (type: Rank) => void;
  setSortedDataTypes: (types: RankType[]) => void;
  resetSortedDataTypes: () => void;
}

// 创建状态管理，使用persist持久化数据到本地存储
export const useRankBarStore = create<RankBarState>()(
  persist(
    (set) => ({
      currentType: dataTypes[0].id,
      sortedDataTypes: [...dataTypes],
      setCurrentType: (type) => set({ currentType: type }),
      setSortedDataTypes: (types) => {
        // 添加数据有效性检查，确保数据完整才更新
        if (!types || !Array.isArray(types) || types.length === 0) {
          console.error('传入的数据无效，重置为默认排序');
          return set({ sortedDataTypes: [...dataTypes] });
        }

        // 检查每个项是否都有id属性
        const isValidData = types.every(item => item && item.id);
        if (!isValidData) {
          console.error('传入的数据缺少必要属性，重置为默认排序');
          return set({ sortedDataTypes: [...dataTypes] });
        }

        return set({ sortedDataTypes: types });
      },
      resetSortedDataTypes: () => set({ sortedDataTypes: [...dataTypes] }),
    }),
    {
      name: "rank-bar-storage",
      storage: createJSONStorage(() => ({
        getItem: async (name) => {
          const value = Taro.getStorageSync(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          Taro.setStorageSync(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          Taro.removeStorageSync(name);
        },
      })),
    }
  )
);
