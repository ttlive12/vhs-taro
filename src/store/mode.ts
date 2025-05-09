import { create } from "zustand";
import { Mode } from "@/constants";

interface ModeStore {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const useModeStore = create<ModeStore>((set) => ({
  mode: Mode.STANDARD,
  setMode: (mode: Mode) => set({ mode }),
}));

export default useModeStore;
