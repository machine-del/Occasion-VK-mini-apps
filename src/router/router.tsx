import { observer } from "mobx-react-lite";
import { Route, Routes } from "react-router-dom";
import { Auth } from "../pages/Auth/Auth";
import { Settings } from "../pages/Auth/Settings";

export const Router = observer(() => {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
});
