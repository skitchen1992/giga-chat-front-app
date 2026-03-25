import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./index";
import "./styles/global.css";
import { Provider } from "react-redux";
import { store } from "./store";
import { AuthInit } from "@/features/auth";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthInit>
        <App />
      </AuthInit>
    </Provider>
  </StrictMode>
);
