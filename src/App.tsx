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
import {
  useAppearance,
  useInsets,
  useAdaptivity,
} from "@vkontakte/vk-bridge-react";
import { parseURLSearchParamsForGetLaunchParams } from "@vkontakte/vk-bridge";
import { Router } from "./router/router";
import { RootStore } from "./store/rootStore";
import { StoreContext } from "./store/StoreProvider";
import { transformVKBridgeAdaptivity } from "./helpers/transformVKBridgeAdaptivity";

const rootStore = new RootStore();

export const App = observer(() => {
  const vkBridgeInsets = useInsets() || undefined;
  const vkBridgeAdaptivityRaw = useAdaptivity();
  const vkBridgeAdaptivityProps = transformVKBridgeAdaptivity(
    vkBridgeAdaptivityRaw,
  );
  const vk_platform = parseURLSearchParamsForGetLaunchParams(
    window.location.search,
  ).vk_platform;

  const { isReady, initApp } = rootStore.authStore;

  useEffect(() => {
    vkBridge.send("VKWebAppInit");
    initApp();
  }, []);

  if (!isReady) {
    return <ScreenSpinner state="loading" />;
  }

  return (
    <StoreContext.Provider value={rootStore}>
      <ConfigProvider
        colorScheme="light"
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
