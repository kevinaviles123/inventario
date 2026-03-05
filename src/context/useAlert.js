import { useContext } from "react";
import { AlertContext } from "./AlertContext";

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert debe usarse dentro de <AlertProvider>");
  }
  return context;
}

// Uso en cualquier componente:
// const { showSuccess, showError, showConfirm } = useAlert();
// showSuccess("Guardado", "El producto fue creado correctamente");
// showError("Error", "No se pudo conectar al servidor");
// showConfirm("¿Eliminar?", "Esta acción no se puede deshacer",
//   () => handleDelete(),
//   () => console.log("cancelado")
// );

