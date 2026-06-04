import { makeAutoObservable, runInAction } from "mobx";
import type { RootStore } from "../rootStore";
import type { User } from "../../types/user";

export class UserStore {
  rootStore: RootStore;
  user: User | null = null;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = rootStore;
  }

  setUser(user: User) {
    this.user = user;
    localStorage.setItem("user", JSON.stringify(user));
  }

  updateUser(data: Partial<User>) {
    if (this.user) {
      this.user = { ...this.user, ...data };
      localStorage.setItem("user", JSON.stringify(this.user));
    }
  }

  async saveInterests(interests: string[]) {
    if (!this.user) return;

    await new Promise((resolve) => setTimeout(resolve, 500));
    this.updateUser({ interests });
    console.log("Интересы сохранены:", interests);
  }

  getUserInterests(): string[] {
    return this.user?.interests || [];
  }

  loadFromLocalStorage() {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
  }

  clearUser() {
    this.user = null;
    localStorage.removeItem("user");
  }
}
