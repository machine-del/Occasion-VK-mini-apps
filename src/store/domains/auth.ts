import { makeAutoObservable, runInAction } from "mobx";
import type { RootStore } from "../rootStore";

interface User {
  id: number;
  vkId: number;
  fullName: string;
  firstName?: string;
  lastName?: string;
  city: string;
  age: number;
  friends: [];
  role: "user" | "moderation";
  photoUrl?: string;
}

export class AuthStore {
  rootStore: RootStore;
  user: User | null = null;
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
        this.user = JSON.parse(savedUser);
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
        role: "moderation",
      };

      const mockToken = "mock-token-123";

      runInAction(() => {
        this.user = mockUser;
        this.token = mockToken;
        localStorage.setItem("token", mockToken);
        localStorage.setItem("user", JSON.stringify(mockUser));
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

  async register(_userData: Partial<User>, _password: string) {
    this.isLoading = true;
    this.error = null;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
    this.user = null;
    this.token = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAuth");
  }

  get isAuth() {
    return !!this.token && !!this.user;
  }

  get isModeration() {
    return this.user?.role === "moderation";
  }

  get isUser() {
    return this.user?.role === "user";
  }
}
