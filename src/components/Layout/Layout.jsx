import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useInventory } from "../../contexts/InventoryContext";
import OfflineBanner from "../Common/OfflineBanner";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isOnline } = useInventory();
  const location = useLocation();

  useEffect(() => {
    // Cerrar sidebar en móvil al cambiar de ruta
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        
        {!isOnline && <OfflineBanner />}
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;