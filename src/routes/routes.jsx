import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../layouts/Layouts';

import Login from '../pages/auth/Login';
import HomePage from '../pages/HomePage';
import VehiclesPage from '../pages/vehicles/VehiclesPage';


import SettingsPage from '../pages/settings/SettingsPage';
import UsersPage from '../pages/users/UsersPge';

import InvoicePage from '../pages/invoice/InvoicePage';
import ExpensePage from '../pages/expense/ExpensePage';
import InfractionPage from '../pages/infraction/InfractionPage';
import NotFoundPage from '../pages/NotFoundPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';


// Add these imports for your detail/edit pages
import VehicleDetails from '../pages/vehicles/components/VehicleDetails';
import EditVehicle from '../pages/vehicles/components/EditVehicle';
import CreateVehicle from '../pages/vehicles/components/CreateVehicle';
import CreateUser from '../pages/users/components/CreateUser';
import EditUser from '../pages/users/components/EditeUser';
import ShowUser from '../pages/users/components/ShowUser';
import AllClients from '../pages/clients/components/AllClients';
import ShowClient from '../pages/clients/components/ShowClient';
import EditClient from '../pages/clients/components/EditClinet';
import CreateClient from '../pages/clients/components/CreateClient';
import AllReservation from '../pages/reservations/components/AllReservation';
import ShowReservation from '../pages/reservations/components/ShowReservation';
import EditReservation from '../pages/reservations/components/EditReservation';
import CreateReservation from '../pages/reservations/components/CreateReservation';
// Contract
import AllContract from '../pages/contract/components/AllContract';
import CreateContract from '../pages/contract/components/CreateContract';
import EditContract from '../pages/contract/components/EditContract';
import ShowContract from '../pages/contract/components/ShowContract';
import AllRevenue from '../pages/revenue/components/AllRevenue';
import CreateRevenue from '../pages/revenue/components/CreateRevenue';
import ShowRevenue from '../pages/revenue/components/ShowRevenue';
import EditRevenue from '../pages/revenue/components/EditRevenue';
import AllInfraction from '../pages/infraction/components/AllInfraction';


export const routes = createBrowserRouter([
  // Public routes
  {
    path: "/login",
    element: <Login />,
  },
  

  {
    element: <ProtectedRoute />, // Global protection: user must be logged in.
    children: [
      {
        element: <Layout />, // Your common layout with Navbar and Sidebar
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/settings", element: <SettingsPage /> },
          
          // ADMIN ONLY
          {
            element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
            children: [
              { path: "/users", element: <UsersPage /> },
              { path: "/users/add", element: <CreateUser /> },
              { path: "/users/view/:id", element: <ShowUser /> },
              { path: "/users/edit/:id", element: <EditUser /> },

              //Clients 
              { path: "/clients", element: <AllClients /> },
              { path: "/clients/add", element: <CreateClient /> },
              { path: "/clients/view/:id", element: <ShowClient /> },
              { path: "/clients/edit/:id", element: <EditClient /> },

              //reservations
              { path: "/reservations", element: <AllReservation /> },
              { path: "/reservations/add", element: <CreateReservation /> },
              { path: "/reservations/view/:id", element: <ShowReservation /> },
              { path: "/reservations/edit/:id", element: <EditReservation /> },
              //Contract  
              { path: "/contract", element: <AllContract />  },
              { path: "/contract/add", element: <CreateContract /> },
              { path: "/contract/view/:id", element: <ShowContract /> },
              { path: "/contract/edit/:id", element: <EditContract /> },
            
              //AllRevenue  
              { path: "/revenue", element: <AllRevenue />  },
              { path: "/revenue/add", element: <CreateRevenue /> },
              { path: "/revenue/view/:id", element: <ShowRevenue /> },
              { path: "/revenue/edit/:id", element: <EditRevenue /> },

              { path: "/infraction", element: <AllInfraction /> },
              

            ],
          },
          
          // ADMIN and ACCOUNTANT
          {
            element: <ProtectedRoute allowedRoles={["ADMIN", "ACCOUNTANT"]} />,
            children: [
              // { path: "/revenues", element: <AllRevenue /> },
              { path: "/expense", element: <ExpensePage /> },
              { path: "/invoice", element: <InvoicePage /> },
            ],
          },
          
          // ADMIN and ADMINISTRATEUR
          {
            element: <ProtectedRoute allowedRoles={["ADMIN", "ADMINISTRATEUR"]} />,
            children: [
              // Vehicle routes
              { path: "/vehicles", element: <VehiclesPage /> },
              { path: "/vehicles/view/:id", element: <VehicleDetails /> },
              { path: "/vehicles/add", element: <CreateVehicle /> },
              { path: "/vehicles/edit/:id", element: <EditVehicle /> },
              
              
              
              
              // { path: "/clients/view/:id", element: <OneVehicle /> },
              // { path: "/clients/edit/:id", element: <OneVehicle /> },
              
              // { path: "/contract", element: <ContractPage /> },
              // { path: "/contract/view/:id", element: <OneVehicle /> },
              // { path: "/contract/edit/:id", element: <OneVehicle /> },
              
              // { path: "/infraction", element: <InfractionPage /> },
              // { path: "/infraction/view/:id", element: <OneVehicle /> },
              // { path: "/infraction/edit/:id", element: <OneVehicle /> },
              
            ],
          },
        ],
      },
    ],
  },
  // Unauthorized route
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  // Fallback (NotFound) route
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);