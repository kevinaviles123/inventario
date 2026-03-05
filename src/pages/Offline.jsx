import React from "react";
import { HiOutlineWifi } from "react-icons/hi";

const Offline = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <HiOutlineWifi className="h-12 w-12 text-yellow-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sin conexión a internet
          </h1>
          
          <p className="text-gray-600 mb-6">
            No te preocupes, puedes seguir usando la aplicación. 
            Los cambios se sincronizarán automáticamente cuando recuperes la conexión.
          </p>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Reintentar conexión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Offline;