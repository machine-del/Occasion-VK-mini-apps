import { useContext } from "react";
import { StoreContext } from "./StoreProvider";

export function useStores() {
  const stores = useContext(StoreContext);

  if (!stores) throw new Error("ошибка в StoreProvider");

  return stores;
}
