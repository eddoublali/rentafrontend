import { Link } from 'react-router-dom';

const SidebarLink = ({ to, icon, label, isActive, isOpen }) => {
  return (
    <Link 
      to={to} 
      className={`flex items-center justify-${isOpen ? 'start' : 'center'} w-full px-3 py-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-sky-600 font-medium ' 
          : 'hover:bg-base-200 text-base-content'
      }`}
      title={!isOpen ? label : ""}
    >
      <div className={`flex items-center ${!isOpen && 'justify-center w-full'}`}>
        <div className="flex items-center justify-center">
          {icon}
        </div>
        {isOpen && <span className="mx-3">{label}</span>}
      </div>
    </Link>
  );
};

export default SidebarLink;
