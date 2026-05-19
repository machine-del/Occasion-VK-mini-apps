import { createContext, type ReactNode } from "react";
import { RootStore, rootStore } from "./rootStore";

export const StoreContext = createContext<RootStore | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
  );
}
