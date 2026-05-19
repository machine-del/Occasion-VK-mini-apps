import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from "../rootStore";
import type { NavigateFunction } from "react-router-dom";

export class AuthViewModel {
  rootStore: RootStore;
  isLoading: boolean = true;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = rootStore;
  }

  async initialize() {
    this.isLoading = true;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    runInAction(() => {
      this.isLoading = false;
    });
  }

  get shouldShowAuth() {
    return !this.isLoading && !this.rootStore.authStore.isAuth;
  }

  get shouldShowApp() {
    return !this.isLoading && this.rootStore.authStore.isAuth;
  }

  handleAuthRedirect(navigate: NavigateFunction) {
    if (this.shouldShowApp) {
      navigate("/app", { replace: true });
      return true;
    }
    return false;
  }
}
