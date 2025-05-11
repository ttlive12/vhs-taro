import Taro from "@tarojs/taro";
import { create } from "zustand";
import { createJSONStorage,persist } from "zustand/middleware";

import { Mode } from "@/constants";

interface ModeStore {
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
}

const useModeStore = create<ModeStore>()(
  persist(
    (set, get) => ({
      mode: Mode.STANDARD,
      setMode: (mode: Mode) => set({ mode }),
      toggleMode: () => {
        const currentMode = get().mode;
        set({ mode: currentMode === Mode.STANDARD ? Mode.WILD : Mode.STANDARD });
      },
    }),
    {
      name: "mode-storage",
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

export default useModeStore;
