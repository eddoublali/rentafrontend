import React, { useState } from "react";
import rentalogo from "../../assets/rentalogo.png";
import { Bell, Globe, LogOut, Settings, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();

  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      <div className="flex-1">
        <img src={rentalogo} alt="Logo" className="h-10" />
      </div>

      <div className="flex-none gap-4 items-center">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle m-1">
            <div className="indicator">
              <Bell className="w-5 h-5" />
              <span className="badge badge-xs bg-sky-600 text-white indicator-item">
                0
              </span>
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-64"
          >
            <li>{t("notifications.reservation")}</li>
            <li>{t("notifications.maintenance")}</li>
            <li>{t("notifications.payment")}</li>
          </ul>
        </div>

        {/* Profile Dropdown */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="indicator w-10 h-10 p-2 border rounded-full flex items-center justify-center text-primary">
              <User className="w-5 h-5" />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/settings">
                <Settings className="w-4 h-4" />
                {t("navbar.profileSettings") || "Profile Settings"}
              </Link>
            </li>
            <li>
              <a onClick={logout}>
                <LogOut className="w-4 h-4" />
                {t("navbar.logout") || "Logout"}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
