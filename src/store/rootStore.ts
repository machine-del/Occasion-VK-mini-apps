import { AuthStore } from "./domains/auth";

export class RootStore {
  authStore: AuthStore;

  constructor() {
    this.authStore = new AuthStore(this);
  }
}

export const rootStore = new RootStore();
