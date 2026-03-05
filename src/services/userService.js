import { getDB, saveDB, generateId } from "./storage";

export function registerUser({ name, email, password }) {
  const db = getDB();

  const exists = db.users.find(
    (u) =>
      u.email.toLowerCase().trim() === email.toLowerCase().trim()
  );
  if (exists) throw new Error("El email ya está registrado");

  const newUser = {
    id: generateId(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: password,
    role: "admin",
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDB(db);
  return newUser;
}

export function loginUser({ email, password }) {
  const db = getDB();

  const user = db.users.find(
    (u) =>
      u.email.toLowerCase().trim() === email.toLowerCase().trim() &&
      u.password === password
  );

  if (!user) throw new Error("Email o contraseña incorrectos");

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

