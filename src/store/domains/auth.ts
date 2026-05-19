import { makeAutoObservable, runInAction } from "mobx";
import type { RootStore } from "../rootStore";

interface User {
  id: number;
  vkId: number;
  fullName: string;
  city: string;
  age: number;
  friends: [];
  role: "user" | "moderation";
}

export class AuthStore {
  rootStore: RootStore;
  user: User | null = null;
  token: string | null = null;
  isLoading: boolean = false;
  error: string | null = null;
  isReady = false;

  vkBridgeColorScheme: string | undefined = undefined;
  vkBridgeInsets: any = undefined;
  vkBridgeAdaptivityProps: any = {};
  vk_platform: string | undefined = undefined;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = rootStore;
  }

  setVKBridgeData(data: {
    colorScheme?: string;
    insets?: any;
    adaptivityProps?: any;
    platform?: string;
  }) {
    this.vkBridgeColorScheme = data.colorScheme;
    this.vkBridgeInsets = data.insets;
    this.vkBridgeAdaptivityProps = data.adaptivityProps || {};
    this.vk_platform = data.platform;
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

  async login(vkId: string, _password: string) {
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
