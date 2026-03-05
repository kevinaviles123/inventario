import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { InventoryProvider } from "./contexts/InventoryContext";
import { AlertProvider } from "./context/AlertProvider";
import { seedDatabase } from "./data/seedData";
import { seedTestUser } from "./services/storage";

const root = ReactDOM.createRoot(document.getElementById("root"));

seedDatabase();
seedTestUser();

root.render(
  <BrowserRouter>
    <AuthProvider>
      <AlertProvider>
        <InventoryProvider>
          <App />
        </InventoryProvider>
      </AlertProvider>
    </AuthProvider>
  </BrowserRouter>
);

// Registramos el Service Worker para PWA
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    const waitingServiceWorker = registration.waiting;
    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener("statechange", (event) => {
        if (event.target.state === "activated") {
          window.location.reload();
        }
      });
      waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
    }
  },
});