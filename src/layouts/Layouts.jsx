import React from "react";
import Sidebar from "./Sidebar/Sidebar"; 
import Navbar from "./Navbar/Navbar";
import { Outlet } from "react-router-dom"; // Outlet renders the child route content

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
     
      <div className="flex flex-1 overflow-hidden"> 
      <Sidebar />
      <div className="w-full flex-1 overflow-y-auto">
          <Navbar />
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default Layout;
