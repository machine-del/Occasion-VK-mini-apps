import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from "../rootStore";
import vkBridge from "@vkontakte/vk-bridge";
import type { NavigateFunction } from "react-router-dom";

export class AuthViewModel {
  rootStore: RootStore;
  isLoading: boolean = true;
  isLoadingAuth: boolean = false;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = rootStore;
  }

  get authStore() {
    return this.rootStore.authStore;
  }

  get shouldShowAuth() {
    return !this.isLoading && !this.rootStore.authStore.isAuth;
  }

  get shouldShowApp() {
    return !this.isLoading && this.rootStore.authStore.isAuth;
  }

  async initialize() {
    runInAction(() => {
      this.isLoading = true;
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    runInAction(() => {
      this.isLoading = false;
    });
  }

  async handleVKLogin() {
    this.isLoadingAuth = true;

    try {
      const result = await vkBridge.send("VKWebAppGetAuthToken", {
        app_id: 54594845,
        scope: "friends,photos",
      });

      if (result.access_token) {
        const userData = await vkBridge.send("VKWebAppGetUserInfo", {});

        const additionalData = await vkBridge.send("VKWebAppCallAPIMethod", {
          method: "users.get",
          params: {
            user_ids: userData.id,
            fields: "city,bdate,photo_200",
            access_token: result.access_token,
            v: "5.131",
          },
        });

        const friendsData = await vkBridge.send("VKWebAppCallAPIMethod", {
          method: "friends.get",
          params: {
            user_id: userData.id,
            fields: "id,first_name,last_name",
            access_token: result.access_token,
            v: "5.131",
          },
        });

        const vkUser = additionalData.response?.[0];
        const age = this.calculateAge(vkUser?.bdate);

        await this.rootStore.authStore.login(
          userData.id.toString(),
          result.access_token,
          {
            fullName: `${userData.first_name} ${userData.last_name}`,
            firstName: userData.first_name,
            lastName: userData.last_name,
            city: vkUser?.city?.title || "Не указан",
            age: age,
            friends: friendsData.response?.items || [],
            photoUrl: vkUser?.photo_200 || userData.photo_200,
          },
        );
      }
    } catch (error) {
      console.error("Ошибка авторизации VK ID:", error);

      if (error && typeof error === "object" && "message" in error) {
        const errorMessage = error.message as string;
        if (errorMessage?.includes("canceled")) {
          console.log("Пользователь отменил авторизацию");
        }
      }
    } finally {
      runInAction(() => {
        this.isLoadingAuth = false;
      });
    }
  }

  private calculateAge(bdate: string): number {
    if (!bdate) return 0;
    const parts = bdate.split(".");
    if (parts.length < 3) return 0;

    const birthDate = new Date(
      parseInt(parts[2]),
      parseInt(parts[1]) - 1,
      parseInt(parts[0]),
    );
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  handleAuthRedirect(navigate: NavigateFunction) {
    if (this.shouldShowApp) {
      navigate("/settings", { replace: true });
      return true;
    }
    return false;
  }
}
