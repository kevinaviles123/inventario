import { getDB, saveDB, generateId } from "./storage";

export function getCategories() {
  return getDB().categories.filter((c) => c.isActive !== false);
}

export function createCategory({ name, color, description }) {
  const db = getDB();
  const category = {
    id: generateId(),
    name,
    color: color || "#6366f1",
    description: description || "",
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  db.categories.push(category);
  saveDB(db);
  return category;
}

export function updateCategory(id, data) {
  const db = getDB();
  const index = db.categories.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Categoría no encontrada");
  db.categories[index] = { ...db.categories[index], ...data };
  saveDB(db);
  return db.categories[index];
}

export function deleteCategory(id) {
  const db = getDB();
  const index = db.categories.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Categoría no encontrada");
  db.categories[index].isActive = false;
  saveDB(db);
  return true;
}

