import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@vkontakte/vkui/dist/cssm/styles/themes.css";
import { App } from "./App.tsx";
import "./app.style.css";
import "./styles/fonts.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
