import React, { useState } from "react";
import { HiOutlineQrcode } from "react-icons/hi";
import QRScanner from "../QR/QRScanner";

const Header = ({ setSidebarOpen }) => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
      {/* Mobile menu button */}
      <div className="flex items-center">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Abrir menú</span>
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <h1 className="ml-2 text-lg font-semibold text-gray-900 hidden md:block">
          Panel de inventario
        </h1>
      </div>

      <div className="flex items-center space-x-3">
        <span className="hidden text-sm text-gray-500 sm:inline">
          Bienvenido a InventarioPro
        </span>
        <button
          type="button"
          onClick={() => setIsScannerOpen(true)}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
        >
          <HiOutlineQrcode className="h-4 w-4 mr-1.5" />
          Escanear QR
        </button>
      </div>

      <QRScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </header>
  );
};

export default Header;

