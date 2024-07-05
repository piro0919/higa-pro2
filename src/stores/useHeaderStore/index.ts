import { ReactNode } from "react";
import { create } from "zustand";

export type HeaderState = {
  header: ReactNode;
  setHeader: (header: ReactNode) => void;
};

const useHeaderStore = create<HeaderState>((set) => ({
  header: null,
  setHeader: (header): void => set({ header }),
}));

export default useHeaderStore;
