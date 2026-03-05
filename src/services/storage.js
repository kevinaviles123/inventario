const DB_KEY = "inventariopro_db";

export function getDB() {
  try {
    const data = localStorage.getItem(DB_KEY);
    if (!data)
      return {
        users: [],
        products: [],
        categories: [],
        movements: [],
        alerts: [],
        warehouses: [],
      };
    return JSON.parse(data);
  } catch {
    return {
      users: [],
      products: [],
      categories: [],
      movements: [],
      alerts: [],
      warehouses: [],
    };
  }
}

export function saveDB(db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    return true;
  } catch {
    return false;
  }
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function seedTestUser() {
  const db = getDB();
  const exists = db.users.find((u) => u.email === "admin@test.com");
  if (!exists) {
    db.users.push({
      id: "test-user-001",
      name: "Administrador",
      email: "admin@test.com",
      password: "Admin123",
      role: "admin",
      createdAt: new Date().toISOString(),
    });
    saveDB(db);
  }
}

