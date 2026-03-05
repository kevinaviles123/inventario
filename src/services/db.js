import Dexie from "dexie";

export const db = new Dexie("inventarioDB");

db.version(1).stores({
  products: "++id, name, sku, categoryId, price, stock, minStock, image, syncStatus",
  categories: "++id, name, color, syncStatus",
  movements: "++id, productId, type, qty, reason, date, syncStatus",
  pendingSync: "++id, table, operation, data, timestamp",
});

db.open().catch((err) => {
  console.error("Failed to open database:", err);
});

const defaultCategories = [
  { name: "Lácteos", color: "#3B82F6" },
  { name: "Bebidas", color: "#10B981" },
  { name: "Snacks", color: "#F59E0B" },
  { name: "Limpieza", color: "#8B5CF6" },
  { name: "Panadería", color: "#EF4444" },
  { name: "Carnes", color: "#EC4899" },
  { name: "Frutas y Verduras", color: "#22C55E" },
  { name: "Congelados", color: "#06B6D4" },
  { name: "Higiene Personal", color: "#F97316" },
  { name: "Electrónica", color: "#6366F1" },
  { name: "Ropa", color: "#84CC16" },
  { name: "Ferretería", color: "#78716C" },
  { name: "Papelería", color: "#F43F5E" },
  { name: "Juguetes", color: "#A855F7" },
  { name: "Mascotas", color: "#14B8A6" },
  { name: "Farmacia", color: "#0EA5E9" },
  { name: "Otros", color: "#94A3B8" },
];

// Helper functions
export const dbService = {
  // Products
  async getProducts() {
    return await db.products.toArray();
  },
  
  async addProduct(product) {
    const id = await db.products.add({
      ...product,
      syncStatus: "pending",
      createdAt: new Date().toISOString(),
    });
    await this.addToPendingSync("products", "add", { id, ...product });
    return id;
  },
  
  async updateProduct(id, product) {
    await db.products.update(id, {
      ...product,
      syncStatus: "pending",
      updatedAt: new Date().toISOString(),
    });
    await this.addToPendingSync("products", "update", { id, ...product });
  },
  
  async deleteProduct(id) {
    await db.products.delete(id);
    await this.addToPendingSync("products", "delete", { id });
  },

  // Categories
  async getCategories() {
    return await db.categories.toArray();
  },
  
  async addCategory(category) {
    const id = await db.categories.add({
      ...category,
      syncStatus: "pending",
    });
    await this.addToPendingSync("categories", "add", { id, ...category });
    return id;
  },

  async updateCategory(id, category) {
    await db.categories.update(id, {
      ...category,
      syncStatus: "pending",
      updatedAt: new Date().toISOString(),
    });
    await this.addToPendingSync("categories", "update", { id, ...category });
  },

  async deleteCategory(id) {
    await db.categories.delete(id);
    await this.addToPendingSync("categories", "delete", { id });
  },

  // Movements
  async addMovement(movement) {
    const date = movement.date || new Date().toISOString();
    const movementToSave = {
      ...movement,
      date,
      syncStatus: "pending",
    };

    const id = await db.movements.add({
      ...movementToSave,
    });
    
    // Update product stock
    const product = await db.products.get(movement.productId);
    if (product) {
      const newStock = movement.type === "entrada" 
        ? product.stock + movement.qty 
        : product.stock - movement.qty;
      
      await db.products.update(movement.productId, {
        stock: newStock,
        syncStatus: "pending",
      });
    }
    
    await this.addToPendingSync("movements", "add", { id, ...movementToSave });
    return id;
  },

  async getMovements() {
    return await db.movements.toArray();
  },

  async updateMovement(id, movement) {
    await db.movements.update(id, {
      ...movement,
      syncStatus: "pending",
      updatedAt: new Date().toISOString(),
    });
    await this.addToPendingSync("movements", "update", { id, ...movement });
  },

  async deleteMovement(id) {
    await db.movements.delete(id);
    await this.addToPendingSync("movements", "delete", { id });
  },

  async seedDefaultCategories() {
    const count = await db.categories.count();
    if (count === 0) {
      await db.categories.bulkAdd(defaultCategories);
    }
  },

  // Pending sync
  async addToPendingSync(table, operation, data) {
    await db.pendingSync.add({
      table,
      operation,
      data,
      timestamp: new Date().toISOString(),
    });
  },

  async getPendingSync() {
    return await db.pendingSync.toArray();
  },

  async clearPendingSync(ids) {
    await db.pendingSync.bulkDelete(ids);
  },
};