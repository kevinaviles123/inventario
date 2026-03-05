import { getDB, saveDB, generateId } from "./storage";

export function checkAndCreateAlert(product) {
  const db = getDB();

  db.alerts = db.alerts.map((a) =>
    a.productId === product.id && !a.isResolved
      ? {
          ...a,
          isResolved: true,
          resolvedAt: new Date().toISOString(),
        }
      : a
  );

  if (product.quantity === 0) {
    db.alerts.push({
      id: generateId(),
      productId: product.id,
      type: "sin_stock",
      currentQuantity: 0,
      minStock: product.minStock,
      isRead: false,
      isResolved: false,
      createdAt: new Date().toISOString(),
    });
  } else if (product.quantity <= product.minStock) {
    db.alerts.push({
      id: generateId(),
      productId: product.id,
      type: "bajo_stock",
      currentQuantity: product.quantity,
      minStock: product.minStock,
      isRead: false,
      isResolved: false,
      createdAt: new Date().toISOString(),
    });
  }

  saveDB(db);
}

export function getAlerts() {
  return getDB().alerts.filter((a) => !a.isResolved);
}

export function getUnreadAlertCount() {
  return getDB().alerts.filter(
    (a) => !a.isRead && !a.isResolved
  ).length;
}

export function markAlertRead(id) {
  const db = getDB();
  const index = db.alerts.findIndex((a) => a.id === id);
  if (index !== -1) {
    db.alerts[index].isRead = true;
    saveDB(db);
  }
}

export function markAllAlertsRead() {
  const db = getDB();
  db.alerts = db.alerts.map((a) => ({ ...a, isRead: true }));
  saveDB(db);
}

