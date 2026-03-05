import React, { useEffect } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineExclamation,
  HiOutlineInformationCircle,
  HiOutlineXCircle,
} from "react-icons/hi";

const Alert = ({ 
  type = "info", 
  title, 
  message, 
  onClose, 
  autoClose = false,
  duration = 5000 
}) => {
  const types = {
    success: {
      icon: HiOutlineCheckCircle,
      bgColor: "bg-green-50",
      borderColor: "border-green-400",
      textColor: "text-green-800",
      iconColor: "text-green-400",
      titleColor: "text-green-800",
    },
    error: {
      icon: HiOutlineXCircle,
      bgColor: "bg-red-50",
      borderColor: "border-red-400",
      textColor: "text-red-800",
      iconColor: "text-red-400",
      titleColor: "text-red-800",
    },
    warning: {
      icon: HiOutlineExclamation,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-400",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-400",
      titleColor: "text-yellow-800",
    },
    info: {
      icon: HiOutlineInformationCircle,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-400",
      textColor: "text-blue-800",
      iconColor: "text-blue-400",
      titleColor: "text-blue-800",
    },
  };

  const { icon: Icon, bgColor, borderColor, textColor, iconColor, titleColor } = types[type];

  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <div className={`rounded-md ${bgColor} border-l-4 ${borderColor} p-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${titleColor}`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${textColor}`}>
            <p>{message}</p>
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md ${bgColor} hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${type}-500`}
            >
              <span className="sr-only">Cerrar</span>
              <HiOutlineXCircle className={`h-5 w-5 ${iconColor}`} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Versión Toast (notificación flotante)
export const ToastAlert = ({ type = "info", message, onClose }) => {
  const types = {
    success: {
      icon: HiOutlineCheckCircle,
      bgColor: "bg-green-500",
    },
    error: {
      icon: HiOutlineXCircle,
      bgColor: "bg-red-500",
    },
    warning: {
      icon: HiOutlineExclamation,
      bgColor: "bg-yellow-500",
    },
    info: {
      icon: HiOutlineInformationCircle,
      bgColor: "bg-blue-500",
    },
  };

  const { icon: Icon, bgColor } = types[type];

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3`}>
      <Icon className="h-5 w-5" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 hover:opacity-75">
        <HiOutlineXCircle className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Alert;