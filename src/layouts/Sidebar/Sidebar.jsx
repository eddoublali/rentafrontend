import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import SidebarLink from './components/SidebarLink';
import menuItems from './config/menuItems';
import { useAuth } from "../../context/AuthContext";
import { t } from 'i18next';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const getStoredSidebarState = () => {
    const stored = localStorage.getItem('sidebarOpen');
    return stored ? JSON.parse(stored) : true;
  };

  const [isOpen, setIsOpen] = useState(getStoredSidebarState);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isOpen));
  }, [isOpen]);

  const canAccess = (roles) => roles.includes(user?.role);

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className={`sidebar shadow-lg h-full mt-1 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      {/* Toggle Button */}
      <div className="flex justify-end p-2">
        <button onClick={toggleSidebar} className="btn btn-sm btn-ghost btn-circle">
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Sidebar Links */}
      <div className="flex flex-col gap-2 h-full overflow-y-auto px-3 pb-4 text-gray-50 ">
        {menuItems.map(link => (
          canAccess(link.roles) && (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={t(link.label)}
              isActive={location.pathname === link.to}
              isOpen={isOpen}
            />
          )
        ))}

      
      </div>
    </div>
  );
};

export default Sidebar;
