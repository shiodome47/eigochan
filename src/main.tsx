import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { listenForInstallPrompt } from "./utils/installPrompt";
import "./styles/global.css";

// beforeinstallprompt は React が描画する前に飛んでくることがあるので、
// アプリの起動前からリスナーを付けておく。
listenForInstallPrompt();

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element #root が見つかりません");
}

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
