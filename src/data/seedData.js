import { getDB, saveDB } from "../services/storage";
import { generateId } from "../services/storage";

export function seedDatabase() {
  const db = getDB();

  if (db.products.length > 0) return;

  const now = new Date().toISOString();

  const categories = [
    { id: generateId(), name: "Bebidas", color: "#3B82F6", isActive: true, createdAt: now },
    { id: generateId(), name: "Snacks", color: "#F59E0B", isActive: true, createdAt: now },
    { id: generateId(), name: "Limpieza", color: "#10B981", isActive: true, createdAt: now },
  ];

  const products = [
    {
      id: generateId(),
      name: "Agua mineral 1L",
      sku: "AGUA-1L",
      barcode: "1234567890001",
      description: "Botella de agua mineral de 1 litro",
      categoryId: categories[0].id,
      price: 800,
      costPrice: 500,
      quantity: 50,
      minStock: 10,
      unit: "unidad",
      image: null,
      warehouseId: null,
      location: "Estante A1",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: "Gaseosa cola 500ml",
      sku: "COLA-500",
      barcode: "1234567890002",
      description: "Bebida cola de 500ml",
      categoryId: categories[0].id,
      price: 1200,
      costPrice: 700,
      quantity: 5,
      minStock: 10,
      unit: "unidad",
      image: null,
      warehouseId: null,
      location: "Estante A2",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: "Papas fritas 100g",
      sku: "SNACK-100",
      barcode: "1234567890003",
      description: "Bolsa de papas fritas 100g",
      categoryId: categories[1].id,
      price: 900,
      costPrice: 500,
      quantity: 0,
      minStock: 5,
      unit: "unidad",
      image: null,
      warehouseId: null,
      location: "Estante B1",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: "Detergente líquido 1L",
      sku: "DETER-1L",
      barcode: "1234567890004",
      description: "Detergente para ropa 1 litro",
      categoryId: categories[2].id,
      price: 2500,
      costPrice: 1800,
      quantity: 20,
      minStock: 5,
      unit: "unidad",
      image: null,
      warehouseId: null,
      location: "Estante C1",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: "Lavalozas 500ml",
      sku: "LAVALOZ-500",
      barcode: "1234567890005",
      description: "Lavalozas concentrado 500ml",
      categoryId: categories[2].id,
      price: 1500,
      costPrice: 1000,
      quantity: 2,
      minStock: 5,
      unit: "unidad",
      image: null,
      warehouseId: null,
      location: "Estante C2",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
  ];

  db.categories = categories;
  db.products = products;
  saveDB(db);
}

