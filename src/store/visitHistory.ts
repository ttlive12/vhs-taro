import Taro from '@tarojs/taro';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface VisitRecord {
  date: string;
  count: number;
}

interface VisitHistoryState {
  records: VisitRecord[];
  todayVisitCount: number;
  incrementVisit: () => number;
  resetTodayCount: () => void;
}

// 获取当前日期，格式为 YYYY-MM-DD
const getTodayDate = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
};

const useVisitHistoryStore = create<VisitHistoryState>()(
  persist(
    (set, get) => {
      return {
        records: [],
        todayVisitCount: 0,

        incrementVisit: () => {
          const today = getTodayDate();
          const currentCount = get().todayVisitCount;
          const newCount = currentCount + 1;

          // 更新今日访问计数
          set({ todayVisitCount: newCount });

          // 更新记录
          const records = [...get().records];
          const existingRecordIndex = records.findIndex(record => record.date === today);

          if (existingRecordIndex >= 0) {
            records[existingRecordIndex] = { date: today, count: newCount };
          } else {
            records.push({ date: today, count: newCount });
          }

          set({ records });

          return newCount;
        },

        resetTodayCount: () => {
          set({ todayVisitCount: 0 });
        },
      };
    },
    {
      name: 'visit-history-storage',
      storage: createJSONStorage(() => ({
        getItem: name => {
          const data = Taro.getStorageSync(name);
          return data ? JSON.parse(data) : null;
        },
        setItem: (name, value) => {
          Taro.setStorageSync(name, JSON.stringify(value));
        },
        removeItem: name => {
          Taro.removeStorageSync(name);
        },
      })),
      onRehydrateStorage: () => state => {
        // 当存储恢复后，检查日期是否为今天
        if (state) {
          const today = getTodayDate();
          const todayRecord = state.records.find(record => record.date === today);

          // 设置今日访问次数
          state.todayVisitCount = todayRecord ? todayRecord.count : 0;
        }
      },
    }
  )
);

export default useVisitHistoryStore;
