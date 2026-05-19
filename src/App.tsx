import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import {
  ConfigProvider,
  AdaptivityProvider,
  AppRoot,
  ScreenSpinner,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import vkBridge from "@vkontakte/vk-bridge";
import { Router } from "./router/router";
import { RootStore } from "./store/rootStore";
import { StoreContext } from "./store/StoreProvider";

const rootStore = new RootStore();

export const App = observer(() => {
  vkBridge.send("VKWebAppInit");
  const {
    isReady,
    initApp,
    vk_platform,
    vkBridgeAdaptivityProps,
    vkBridgeColorScheme,
    vkBridgeInsets,
  } = rootStore.authStore;

  useEffect(() => {
    initApp();
  }, []);

  if (!isReady) {
    return <ScreenSpinner state="loading" />;
  }

  return (
    <StoreContext.Provider value={rootStore}>
      <ConfigProvider
        colorScheme={vkBridgeColorScheme}
        platform={vk_platform === "desktop_web" ? "vkcom" : undefined}
        isWebView={vkBridge.isWebView()}
      >
        <AdaptivityProvider {...vkBridgeAdaptivityProps}>
          <AppRoot
            disableSettingVKUIClassesInRuntime
            mode="full"
            safeAreaInsets={vkBridgeInsets}
          >
            <Router />
          </AppRoot>
        </AdaptivityProvider>
      </ConfigProvider>
    </StoreContext.Provider>
  );
});
