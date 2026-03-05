import React, { useCallback, useState } from "react";
import { AlertContext } from "./AlertContext";
import AlertModal from "../components/ui/AlertModal";

const initialState = {
  isOpen: false,
  type: "info",
  title: "",
  message: "",
  onConfirm: null,
  onCancel: null,
};

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(initialState);

  const closeAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, isOpen: false, onConfirm: null, onCancel: null }));
  }, []);

  const showAlert = useCallback((type, title, message, extra = {}) => {
    setAlert({
      isOpen: true,
      type,
      title,
      message,
      onConfirm: extra.onConfirm || null,
      onCancel: extra.onCancel || null,
    });
  }, []);

  const showSuccess = (title, message) =>
    showAlert("success", title, message);

  const showError = (title, message) =>
    showAlert("error", title, message);

  const showInfo = (title, message) =>
    showAlert("info", title, message);

  const showWarning = (title, message) =>
    showAlert("warning", title, message);

  const showConfirm = (title, message, onConfirm, onCancel) =>
    showAlert("confirm", title, message, { onConfirm, onCancel });

  const value = {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showConfirm,
    closeAlert,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      <AlertModal alert={alert} onClose={closeAlert} />
    </AlertContext.Provider>
  );
};

