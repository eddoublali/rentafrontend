import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./i18n";
import { AuthProvider } from "./context/AuthContext.jsx";
import { VehicleProvider } from "./context/VehicleContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";

import { ClientProvider } from "./context/ClientContext.jsx";
import { ReservationProvider } from "./context/ReservationContext.jsx";
import { InfractionProvider } from "./context/InfractionContext.jsx";
import { AccidentProvider } from "./context/AccidentContext.jsx";
import { RevenueProvider } from "./context/RevenueContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <UserProvider>
      <ClientProvider>
        <VehicleProvider>
          <ReservationProvider>
            <InfractionProvider>
              <AccidentProvider>
                <RevenueProvider>
                  <App />
                </RevenueProvider>
              </AccidentProvider>
            </InfractionProvider>
          </ReservationProvider>
        </VehicleProvider>
      </ClientProvider>
    </UserProvider>
  </AuthProvider>
);
