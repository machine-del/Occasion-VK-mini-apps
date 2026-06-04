import { AuthStore } from "./domains/AuthStore";
import { UserStore } from "./domains/userStore";

export class RootStore {
  authStore: AuthStore;
  userStore: UserStore;

  constructor() {
    this.authStore = new AuthStore(this);
    this.userStore = new UserStore(this);
  }
}

export const rootStore = new RootStore();
