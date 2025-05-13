import { getSystemInfoSync } from "@tarojs/taro";
import { create } from "zustand";

interface SystemInfoState {
  statusBarHeight: number;
  safeArea: TaroGeneral.SafeAreaResult;
  platform: string;
  safeAreaBottomHeight: number;
  useHeight: number;
  setSystemInfo: (
    info: Omit<SystemInfoState, "setSystemInfo" | "fetchSystemInfo">
  ) => void;
  fetchSystemInfo: () => void;
}

const initialState: Omit<SystemInfoState, "setSystemInfo" | "fetchSystemInfo"> =
  {
    statusBarHeight: 20,
    platform: "ios",
    useHeight: 0,
    safeArea: {
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
    },
    safeAreaBottomHeight: 0,
  };

const useSystemInfoStore = create<SystemInfoState>((set) => ({
  ...initialState,
  setSystemInfo: (info) => set(info),
  fetchSystemInfo: () => {
    try {
      const info = getSystemInfoSync();
      const screenHeight = info.screenHeight;
      const safeAreaBottom = info.safeArea?.bottom ?? screenHeight;
      const safeAreaBottomHeight = screenHeight - safeAreaBottom;
      set({
        statusBarHeight: info.statusBarHeight || initialState.statusBarHeight,
        platform: info.platform || initialState.platform,
        safeArea: info.safeArea || initialState.safeArea,
        safeAreaBottomHeight,
        useHeight: (info.safeArea?.height || info.screenHeight) - 44 - 70,
      });
    } catch {
      set(initialState);
    }
  },
}));

export default useSystemInfoStore;
