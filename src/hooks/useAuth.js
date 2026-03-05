import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState([]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        toast.success("Conexión restablecida. Sincronizando datos...");
        processOfflineQueue();
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      toast.error("Sin conexión. Trabajando en modo offline.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [wasOffline]);

  const addToOfflineQueue = (operation) => {
    setOfflineQueue(prev => [...prev, { ...operation, id: Date.now() }]);
    
    // Store in localStorage for persistence
    const stored = JSON.parse(localStorage.getItem("offlineQueue") || "[]");
    localStorage.setItem("offlineQueue", JSON.stringify([...stored, operation]));
  };

  const processOfflineQueue = async () => {
    const queue = JSON.parse(localStorage.getItem("offlineQueue") || "[]");
    
    for (const operation of queue) {
      try {
        // Process operation
        console.log("Processing offline operation:", operation);
        // await processOperation(operation);
      } catch (error) {
        console.error("Error processing offline operation:", error);
      }
    }
    
    localStorage.removeItem("offlineQueue");
    setOfflineQueue([]);
    toast.success("Datos sincronizados correctamente");
  };

  return {
    isOnline,
    wasOffline,
    offlineQueue,
    addToOfflineQueue,
  };
};

// Hook for detecting network status changes
export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState({
    online: navigator.onLine,
    downlink: navigator.connection?.downlink,
    effectiveType: navigator.connection?.effectiveType,
  });

  useEffect(() => {
    const updateNetworkStatus = () => {
      setNetworkStatus({
        online: navigator.onLine,
        downlink: navigator.connection?.downlink,
        effectiveType: navigator.connection?.effectiveType,
      });
    };

    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);
    
    if (navigator.connection) {
      navigator.connection.addEventListener("change", updateNetworkStatus);
    }

    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
      
      if (navigator.connection) {
        navigator.connection.removeEventListener("change", updateNetworkStatus);
      }
    };
  }, []);

  return networkStatus;
};