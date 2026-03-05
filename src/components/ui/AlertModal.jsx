import React from "react";
import { createPortal } from "react-dom";

const typeStyles = {
  success: {
    bg: "bg-green-100",
    ring: "ring-green-500",
    iconBg: "bg-green-500",
    icon: "✅",
  },
  error: {
    bg: "bg-red-100",
    ring: "ring-red-500",
    iconBg: "bg-red-500",
    icon: "❌",
  },
  info: {
    bg: "bg-blue-100",
    ring: "ring-blue-500",
    iconBg: "bg-blue-500",
    icon: "ℹ️",
  },
  warning: {
    bg: "bg-yellow-100",
    ring: "ring-yellow-500",
    iconBg: "bg-yellow-400",
    icon: "⚠️",
  },
  confirm: {
    bg: "bg-yellow-100",
    ring: "ring-yellow-500",
    iconBg: "bg-yellow-400",
    icon: "⚠️",
  },
};

const AlertModal = ({ alert, onClose }) => {
  if (!alert?.isOpen) return null;

  const { type, title, message, onConfirm, onCancel } = alert;
  const styles = typeStyles[type] || typeStyles.info;

  const handleAccept = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  const content = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`
          relative z-10 w-full max-w-md mx-4
          rounded-2xl bg-white shadow-xl
          transform transition-all duration-200 ease-out
          scale-100 opacity-100
          ring-1 ${styles.ring}
        `}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <span className="sr-only">Cerrar</span>✕
        </button>

        <div className="px-6 pt-6 pb-5">
          <div className="flex items-center space-x-4 mb-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl text-white ${styles.iconBg}`}
            >
              <span aria-hidden="true">{styles.icon}</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              {message && (
                <p className="mt-1 text-sm text-gray-600">{message}</p>
              )}
            </div>
          </div>

          <div className="mt-5 flex justify-end space-x-3">
            {onConfirm && (
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              >
                Cancelar
              </button>
            )}
            <button
              type="button"
              onClick={handleAccept}
              className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const root = document.getElementById("root");
  return root ? createPortal(content, root) : content;
};

export default AlertModal;

