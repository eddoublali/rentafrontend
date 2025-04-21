import { 
  Home, 
  Car, 
  Calendar, 
  Users, 
  Settings, 
  DollarSign, 
  UserCog, 
  FileText, 
  AlertTriangle, 
  Truck, 
  CreditCard,
} from 'lucide-react';


const menuItems = [
  { to: "/", icon: <Home size={20} />, label: "menu.home", roles: ["ADMIN", "ACCOUNTANT", "ADMINISTRATEUR"] },
  { to: "/vehicles", icon: <Car size={20} />, label: "menu.vehicles", roles: ["ADMIN", "ADMINISTRATEUR"] },
  { to: "/reservations", icon: <Calendar size={20} />, label: "menu.reservations", roles: ["ADMIN", "ADMINISTRATEUR"] },
  { to: "/clients", icon: <Users size={20} />, label: "menu.clients", roles: ["ADMIN", "ADMINISTRATEUR"] },
  { to: "/users", icon: <UserCog size={20} />, label: "menu.users", roles: ["ADMIN"] },
  { to: "/contract", icon: <FileText size={20} />, label: "menu.contract", roles: ["ADMIN", "ADMINISTRATEUR"] },
  { to: "/invoice", icon: <FileText size={20} />, label: "menu.invoice", roles: ["ADMIN", "ACCOUNTANT", "ADMINISTRATEUR"] },
  { to: "/infraction", icon: <AlertTriangle size={20} />, label: "menu.infraction", roles: ["ADMIN", "ADMINISTRATEUR"] },
  { to: "/revenue", icon: <DollarSign size={20} />, label: "menu.revenues", roles: ["ADMIN", "ACCOUNTANT", "ADMINISTRATEUR"] },
  { to: "/expense", icon: <CreditCard size={20} />, label: "menu.expense", roles: ["ADMIN", "ACCOUNTANT", "ADMINISTRATEUR"] },
  { to: "/settings", icon: <Settings size={20} />, label: "menu.settings", roles: ["ADMIN", "ACCOUNTANT", "ADMINISTRATEUR"] },
];

export default menuItems;

