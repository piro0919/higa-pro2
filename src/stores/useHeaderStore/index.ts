import { ReactNode } from "react";
import { create } from "zustand";

export type HeaderState = {
  header: ReactNode;
  loaded: boolean;
  setHeader: (header: ReactNode) => void;
  setLoaded: (loaded: boolean) => void;
};

const useHeaderStore = create<HeaderState>((set) => ({
  header: null,
  loaded: false,
  setHeader: (header): void => set({ header }),
  setLoaded: (loaded): void => set({ loaded }),
}));

export default useHeaderStore;
