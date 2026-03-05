import { getDB, saveDB, generateId } from "./storage";
import { checkAndCreateAlert } from "./alertService";

export function createMovement({
  productId,
  type,
  quantity,
  reason,
  notes,
  reference,
}) {
  const db = getDB();
  const productIndex = db.products.findIndex((p) => p.id === productId);
  if (productIndex === -1) throw new Error("Producto no encontrado");

  const product = db.products[productIndex];
  const previousQuantity = product.quantity;
  let newQuantity;
  const qty = parseInt(quantity, 10);

  if (type === "entrada") {
    newQuantity = previousQuantity + qty;
  } else if (type === "salida") {
    if (previousQuantity < qty) {
      throw new Error(
        `Stock insuficiente. Disponible: ${previousQuantity}`
      );
    }
    newQuantity = previousQuantity - qty;
  } else if (type === "ajuste") {
    newQuantity = qty;
  } else {
    throw new Error("Tipo de movimiento inválido");
  }

  db.products[productIndex].quantity = newQuantity;
  db.products[productIndex].updatedAt = new Date().toISOString();

  const movement = {
    id: generateId(),
    productId,
    type,
    quantity: qty,
    previousQuantity,
    newQuantity,
    reason,
    notes: notes || "",
    reference: reference || "",
    createdAt: new Date().toISOString(),
  };

  db.movements.push(movement);
  saveDB(db);

  checkAndCreateAlert(db.products[productIndex]);

  return movement;
}

export function getMovements(filters = {}) {
  const db = getDB();
  let movements = [...db.movements].reverse();

  if (filters.productId) {
    movements = movements.filter(
      (m) => m.productId === filters.productId
    );
  }
  if (filters.type) {
    movements = movements.filter((m) => m.type === filters.type);
  }
  if (filters.startDate) {
    movements = movements.filter(
      (m) => m.createdAt >= filters.startDate
    );
  }
  if (filters.endDate) {
    movements = movements.filter(
      (m) => m.createdAt <= filters.endDate
    );
  }

  return movements;
}

