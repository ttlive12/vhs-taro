import { getSystemInfoSync } from "@tarojs/taro";
import { create } from "zustand";

interface SystemInfoState {
  statusBarHeight: number;
  safeArea: TaroGeneral.SafeAreaResult;
  platform: string;
  setSystemInfo: (
    info: Omit<SystemInfoState, "setSystemInfo" | "fetchSystemInfo">
  ) => void;
  fetchSystemInfo: () => void;
}

const initialState: Omit<SystemInfoState, "setSystemInfo" | "fetchSystemInfo"> =
  {
    statusBarHeight: 20,
    platform: "ios",
    safeArea: {
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
    },
  };

const useSystemInfoStore = create<SystemInfoState>((set) => ({
  ...initialState,
  setSystemInfo: (info) => set(info),
  fetchSystemInfo: () => {
    try {
      const info = getSystemInfoSync();
      set({
        statusBarHeight: info.statusBarHeight || initialState.statusBarHeight,
        platform: info.platform || initialState.platform,
        safeArea: info.safeArea || initialState.safeArea,
      });
    } catch {
      set(initialState);
    }
  },
}));

export default useSystemInfoStore;
