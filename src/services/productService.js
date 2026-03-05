import { getDB, saveDB, generateId } from "./storage";
import { createMovement } from "./movementService";

export function getProducts() {
  return getDB().products.filter((p) => p.isActive !== false);
}

export function getProductById(id) {
  return getDB().products.find((p) => p.id === id);
}

export function getProductByBarcode(code) {
  const db = getDB();
  return db.products.find(
    (p) => p.barcode === code || p.sku === code.toUpperCase()
  );
}

export function createProduct(data) {
  const db = getDB();
  const skuExists = db.products.find(
    (p) => p.sku === data.sku.toUpperCase()
  );
  if (skuExists) throw new Error("El SKU ya existe");

  const quantity = parseInt(data.quantity || 0, 10);

  const newProduct = {
    id: generateId(),
    name: data.name,
    sku: data.sku.toUpperCase(),
    barcode: data.barcode || null,
    description: data.description || "",
    categoryId: data.categoryId,
    price: parseFloat(data.price),
    costPrice: parseFloat(data.costPrice || 0),
    quantity,
    minStock: parseInt(data.minStock || 5, 10),
    unit: data.unit || "unidad",
    image: data.image || null,
    warehouseId: data.warehouseId || null,
    location: data.location || "",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.products.push(newProduct);
  saveDB(db);

  if (newProduct.quantity > 0) {
    createMovement({
      productId: newProduct.id,
      type: "entrada",
      quantity: newProduct.quantity,
      reason: "ajuste_inventario",
      notes: "Stock inicial al crear el producto",
    });
  }

  return newProduct;
}

export function updateProduct(id, data) {
  const db = getDB();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Producto no encontrado");

  db.products[index] = {
    ...db.products[index],
    ...data,
    quantity: db.products[index].quantity,
    updatedAt: new Date().toISOString(),
  };
  saveDB(db);
  return db.products[index];
}

export function deleteProduct(id) {
  const db = getDB();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Producto no encontrado");
  db.products[index].isActive = false;
  db.products[index].updatedAt = new Date().toISOString();
  saveDB(db);
  return true;
}

