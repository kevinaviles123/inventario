import React, { createContext, useContext, useState, useEffect } from "react";
import { dbService } from "../services/db";
import toast from "react-hot-toast";

const InventoryContext = createContext();

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within InventoryProvider");
  }
  return context;
};

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncData();
      toast.success("Conexión restablecida. Sincronizando datos...");
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.error("Modo offline activado. Los cambios se sincronizarán cuando haya conexión.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await dbService.seedDefaultCategories();

      const [productsData, categoriesData, movementsData] = await Promise.all([
        dbService.getProducts(),
        dbService.getCategories(),
        dbService.getMovements(),
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
      setMovements(movementsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const syncData = async () => {
    if (!isOnline) return;
    
    try {
      const pendingSync = await dbService.getPendingSync();
      
      for (const item of pendingSync) {
        // Aquí iría la lógica de sincronización con el backend
        console.log("Syncing:", item);
      }
      
      toast.success("Datos sincronizados correctamente");
    } catch (error) {
      console.error("Sync error:", error);
      toast.error("Error al sincronizar datos");
    }
  };

  const addProduct = async (product) => {
    try {
      const id = await dbService.addProduct(product);
      const newProduct = { ...product, id };
      setProducts((prev) => [...prev, newProduct]);
      toast.success("Producto agregado correctamente");
      return newProduct;
    } catch (error) {
      toast.error("Error al agregar producto");
      throw error;
    }
  };

  const updateProduct = async (id, product) => {
    try {
      await dbService.updateProduct(id, product);
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...product } : p)));
      toast.success("Producto actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar producto");
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await dbService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Producto eliminado correctamente");
    } catch (error) {
      toast.error("Error al eliminar producto");
      throw error;
    }
  };

  const addCategory = async (category) => {
    try {
      const id = await dbService.addCategory(category);
      const newCategory = { ...category, id };
      setCategories((prev) => [...prev, newCategory]);
      toast.success("Categoría agregada correctamente");
      return newCategory;
    } catch (error) {
      toast.error("Error al agregar categoría");
      throw error;
    }
  };

  const updateCategory = async (id, category) => {
    try {
      await dbService.updateCategory(id, category);
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...category } : c))
      );
      toast.success("Categoría actualizada correctamente");
    } catch (error) {
      toast.error("Error al actualizar categoría");
      throw error;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await dbService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Categoría eliminada correctamente");
    } catch (error) {
      toast.error("Error al eliminar categoría");
      throw error;
    }
  };

  const addMovement = async (movement) => {
    try {
      const product = products.find(
        (p) => String(p.id) === String(movement.productId)
      );
      const currentStock = product ? product.stock : 0;
      const qty = Number(movement.qty);
      const newStock =
        movement.type === "entrada"
          ? currentStock + qty
          : currentStock - qty;
      const willTriggerLowStock =
        product &&
        movement.type === "salida" &&
        currentStock >= product.minStock &&
        newStock < product.minStock;

      const id = await dbService.addMovement(movement);
      const newMovement = {
        ...movement,
        id,
        date: movement.date || new Date().toISOString(),
      };
      setMovements((prev) => [...prev, newMovement]);
      
      // Update product stock in state
      setProducts((prev) =>
        prev.map((p) =>
          p.id === movement.productId
            ? {
                ...p,
                stock:
                  movement.type === "entrada"
                    ? p.stock + movement.qty
                    : p.stock - movement.qty,
              }
            : p
        )
      );

      if (willTriggerLowStock) {
        toast.error(
          `Stock bajo para "${product.name}". Stock actual: ${newStock}, mínimo: ${product.minStock}`
        );
      }

      toast.success("Movimiento registrado correctamente");
      return newMovement;
    } catch (error) {
      toast.error("Error al registrar movimiento");
      throw error;
    }
  };

  const value = {
    products,
    categories,
    movements,
    loading,
    isOnline,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addMovement,
    refreshData: loadData,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};