import { makeAutoObservable, runInAction } from "mobx";
import type { RootStore } from "../rootStore";
import type { User } from "../../types/user";

export class AuthStore {
  rootStore: RootStore;
  token: string | null = null;
  isLoading: boolean = false;
  error: string | null = null;
  isReady = false;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = rootStore;
  }

  async initApp() {
    try {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (savedToken && savedUser) {
        this.token = savedToken;
        this.rootStore.userStore.loadFromLocalStorage();
      }

      this.isReady = true;
    } catch (error) {
      console.error(error);
      this.error = "Ошибка загрузки приложения";
      this.isReady = true;
    }
  }

  async login(vkId: string, accessToken: string, userData?: any) {
    this.isLoading = true;
    this.error = null;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: 1,
        vkId: Number(vkId),
        fullName: "Владислав Керимов",
        city: "Чайковский",
        age: 20,
        friends: [],
        interests: userData?.interests || [],
        role: "moderation",
      };

      runInAction(() => {
        this.rootStore.userStore.setUser(mockUser);
        this.token = accessToken;
        localStorage.setItem("token", accessToken);
        localStorage.setItem("isAuth", "true");
      });
    } catch (err: any) {
      runInAction(() => {
        this.error = err.message;
      });
      throw err;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  logout() {
    this.token = null;
    this.rootStore.userStore.clearUser();
    localStorage.removeItem("token");
    localStorage.removeItem("isAuth");
  }

  get isAuth() {
    return !!this.token && !!this.rootStore.userStore.user;
  }
}
