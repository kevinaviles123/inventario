import React from "react";
import { NavLink } from "react-router-dom";
import { useInventory } from "../../contexts/InventoryContext";
import {
  HiOutlineChartPie,
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineSwitchHorizontal,
  HiOutlineChartBar,
  HiOutlineBell,
  HiOutlineLogout,
} from "react-icons/hi";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = ({ open, setOpen }) => {
  const { products } = useInventory();
  const { logout } = useAuth();
  
  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HiOutlineChartPie },
    { name: "Productos", href: "/products", icon: HiOutlineCube },
    { name: "Categorías", href: "/categories", icon: HiOutlineTag },
    { name: "Movimientos", href: "/movements", icon: HiOutlineSwitchHorizontal },
    { name: "Reportes", href: "/reports", icon: HiOutlineChartBar },
    {
      name: "Alertas",
      href: "/alerts",
      icon: HiOutlineBell,
      badge: lowStockCount,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-center bg-primary-600">
          <h1 className="text-xl font-bold text-white">📦 InventarioPro</h1>
        </div>

        <nav className="mt-5 flex-1 space-y-1 px-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <item.icon
                className={({ isActive }) =>
                  `mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? "text-primary-600" : "text-gray-400 group-hover:text-gray-500"
                  }`
                }
              />
              <span className="flex-1">{item.name}</span>
              {item.badge > 0 && (
                <span className="ml-3 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs font-medium">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 border-t border-gray-200 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
          >
            <HiOutlineLogout className="mr-3 h-5 w-5 text-gray-400" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;