import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from "../rootStore";
import type { NavigateFunction } from "react-router-dom";
import type { CitySuggestion } from "../../types/city";
import vkBridge from "@vkontakte/vk-bridge";

export class SettingsViewModel {
  rootStore: RootStore;
  isLoading: boolean = true;
  interests: string[] = [
    "Спорт",
    "Искусство",
    "Путешествие",
    "IT",
    "Компьютерные игры",
    "Технологии",
    "Еда",
    "Настольные игры",
    "Наука",
    "Музыка",
    "Саморазвитие",
    "Образование",
    "Кино",
    "Шопинг",
    "Ресторан",
    "Музей",
    "Отдых",
  ];
  selectedInterests: string[] = [];
  location: string = "";
  minPeople: string = "";
  maxPeople: string = "";
  locationError: string = "";
  peopleError: string = "";
  showAlert: boolean = false;
  alertText: string = "";
  citySuggestions: CitySuggestion[] = [];
  isSearching: boolean = false;
  showSuggestions: boolean = false;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = rootStore;
  }

  get userStore() {
    return this.rootStore.userStore;
  }

  get authStore() {
    return this.rootStore.authStore;
  }

  setLocation(value: string) {
    this.location = value;
    this.locationError = "";

    if (value.length >= 2) {
      this.searchCities(value);
    } else {
      this.citySuggestions = [];
      this.showSuggestions = false;
    }
  }

  selectCity(city: CitySuggestion) {
    this.location = city.title;
    this.citySuggestions = [];
    this.showSuggestions = false;
    this.locationError = "";
  }

  setMinPeople(value: string) {
    if (/^\d*$/.test(value)) {
      this.minPeople = value;
      this.peopleError = "";
    }
  }

  setMaxPeople(value: string) {
    if (/^\d*$/.test(value)) {
      this.maxPeople = value;
      this.peopleError = "";
    }
  }

  toggleInterest(interest: string) {
    if (this.selectedInterests.includes(interest)) {
      this.selectedInterests = this.selectedInterests.filter(
        (item) => item !== interest,
      );
    } else {
      this.selectedInterests = [...this.selectedInterests, interest];
    }
  }

  isInterestSelected(interest: string): boolean {
    return this.selectedInterests.includes(interest);
  }

  clearSuggestions() {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  closeAlert() {
    this.showAlert = false;
    this.alertText = "";
  }

  private validateForm(): boolean {
    let isValid = true;

    if (!this.location.trim()) {
      this.locationError = "Укажите место проведения";
      isValid = false;
    } else if (this.location.length < 2) {
      this.locationError = "Слишком короткое название";
      isValid = false;
    }

    const min = parseInt(this.minPeople);
    const max = parseInt(this.maxPeople);

    if (!this.minPeople) {
      this.peopleError = "Укажите минимальное количество";
      isValid = false;
    } else if (!this.maxPeople) {
      this.peopleError = "Укажите максимальное количество";
      isValid = false;
    } else if (min < 1) {
      this.peopleError = "Не может быть меньше 1";
      isValid = false;
    } else if (max > 1000000) {
      this.peopleError = "Не может быть больше 1.000.000";
      isValid = false;
    } else if (min > max) {
      this.peopleError = "Минимум не может быть больше максимума";
      isValid = false;
    }

    return isValid;
  }

  async searchCities(query: string) {
    if (query.length < 2) return;

    this.isSearching = true;
    this.showSuggestions = true;

    try {
      const token = this.authStore.token;

      if (!token) {
        console.error("Пользователь не авторизован");
        return;
      }

      const result = await vkBridge.send("VKWebAppCallAPIMethod", {
        method: "database.getCities",
        params: {
          q: query,
          country_id: 1,
          count: 10,
          access_token: token,
          v: "5.131",
        },
      });

      runInAction(() => {
        this.citySuggestions =
          result.response?.items?.map((city: any) => ({
            id: city.id,
            title: city.title,
          })) || [];
        this.isSearching = false;
      });
    } catch (error) {
      console.error("Ошибка поиска городов:", error);
      runInAction(() => {
        this.citySuggestions = [];
        this.isSearching = false;
      });
    }
  }

  async handleSubmit(navigate: NavigateFunction) {
    if (!this.validateForm()) {
      return;
    }

    if (this.selectedInterests.length === 0) {
      this.alertText = "Выберите хотя бы один интерес";
      this.showAlert = true;
      return;
    }

    console.log("Данные формы:", {
      interests: this.selectedInterests,
      location: this.location.trim(),
      people: { min: this.minPeople, max: this.maxPeople },
    });

    await this.userStore.saveInterests(this.selectedInterests);
    navigate("/app", { replace: true });
  }
}
