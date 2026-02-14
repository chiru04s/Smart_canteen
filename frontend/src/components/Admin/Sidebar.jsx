/* eslint-disable no-unused-vars */
import React from "react";
import { FaChartLine, FaPlusCircle, FaSignOutAlt, FaUser, FaClipboardList } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/admin");
  };

  const isActive = (path) => location.pathname === path;

  const navItem = (to, icon, label) => (
    <Link to={to}>
      <div className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition ${
        isActive(to) ? "bg-green-900" : "hover:bg-green-800"
      }`}>
        <div className="p-2">{icon}</div>
        <span className="text-xs mt-1">{label}</span>
      </div>
    </Link>
  );

  return (
    <div className="h-screen bg-green-700 w-44 text-white flex flex-col items-center p-4 space-y-2 sticky top-0">
      <div className="text-xs font-bold mb-4 text-center text-green-200 mt-2">ADMIN PANEL</div>

      <div className="flex flex-col space-y-2 w-full">
        {navItem("/admin/dashboard/sales",       <FaChartLine size={22} />,       "Sales")}
        {navItem("/admin/dashboard/orders",      <FaClipboardList size={22} />,   "Orders")}
        {navItem("/admin/dashboard/caterer",     <FaUser size={22} />,            "Caterer")}
        {navItem("/admin/dashboard/items",       <FaPlusCircle size={22} />,      "Add Items")}
      </div>

      <div className="flex-grow" />

      <div
        onClick={handleLogout}
        className="flex flex-col items-center p-2 rounded-lg cursor-pointer hover:bg-green-800 w-full"
      >
        <FaSignOutAlt size={22} />
        <span className="text-xs mt-1">Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;
