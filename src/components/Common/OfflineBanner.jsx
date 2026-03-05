import React, { useEffect, useState } from "react";

const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="w-full bg-yellow-100 border-b border-yellow-300 text-yellow-800 px-4 py-2 text-sm flex items-center justify-between">
      <span>
        Estás sin conexión a internet. Los cambios se sincronizarán cuando vuelvas
        a estar en línea.
      </span>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="ml-4 px-3 py-1 rounded-md bg-yellow-200 hover:bg-yellow-300 text-yellow-900 text-xs font-medium"
      >
        Reintentar
      </button>
    </div>
  );
};

export default OfflineBanner;

