import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  const menus = [
    { title: "Home", icon: "", path: "/" },
    { title: "About", icon: "", path: "/about" },
  ];

  return (
    <div className="flex">
      <div
        className={`${
          isOpen ? "w-64" : "w-20"
        } fixed top-0 left-0 h-screen bg-gradient-to-b from-gray-900 to-gray-700 p-5 pt-8 duration-300`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-9 w-7 h-7 bg-indigo-500 text-white rounded-full shadow-md flex items-center justify-center"
        >
          {isOpen ? "<" : ">"}
        </button>

        {/* Logo / Title */}
        <div className="flex items-center gap-x-3 mb-10">
          <span className="text-3xl">🌐</span>
          {isOpen && <h1 className="text-white text-xl font-bold">My Sidebar</h1>}
        </div>

        {/* Menu Items */}
        <ul className="space-y-4">
          {menus.map((menu, i) => (
            <li key={i}>
              <Link
                to={menu.path}
                className="flex items-center gap-x-3 text-gray-200 p-2 rounded-md cursor-pointer hover:bg-indigo-600 hover:text-white transition-colors"
              >
                <span className="text-xl">{menu.icon}</span>
                {isOpen && <span className="text-sm font-medium">{menu.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 min-h-screen bg-gray-100 p-6 ml-20 ${
          isOpen ? "ml-64" : "ml-20"
        } overflow-y-auto`}
      >
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
