import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { VehicleProvider } from "./context/VehicleContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import "./i18n";
import { ClientProvider } from "./context/ClientContext.jsx";
import { ReservationProvider } from "./context/ReservationContext.jsx";
import { InfractionProvider } from "./context/InfractionContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <UserProvider>
    <ClientProvider>
      <VehicleProvider>
      <ReservationProvider>
        <InfractionProvider>
          <App />
        </InfractionProvider>
      </ReservationProvider>
      </VehicleProvider>
    </ClientProvider>
    </UserProvider>
  </AuthProvider>
);
