import { getDB } from "./storage";

export function getDashboardStats() {
  const db = getDB();
  const activeProducts = db.products.filter((p) => p.isActive !== false);

  return {
    totalProducts: activeProducts.length,
    totalStockValue: activeProducts.reduce(
      (sum, p) => sum + (p.quantity * (p.costPrice || 0)),
      0
    ),
    lowStockCount: activeProducts.filter(
      (p) => p.quantity > 0 && p.quantity <= p.minStock
    ).length,
    outOfStockCount: activeProducts.filter(
      (p) => p.quantity === 0
    ).length,
    totalCategories: db.categories.filter(
      (c) => c.isActive !== false
    ).length,
    recentMovements: [...db.movements].reverse().slice(0, 8),
  };
}

