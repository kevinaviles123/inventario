import { useState, useEffect } from "react";
import { dbService } from "../services/db";
import { useInventory } from "../contexts/InventoryContext";

export const useInventory = () => {
  const context = useInventory();
  return context;
};

// Custom hook for product search
export const useProductSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const searchProducts = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const products = await dbService.searchProducts(query);
        setResults(products);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return { results, loading, query, setQuery };
};

// Custom hook for product movements
export const useProductMovements = (productId) => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovements = async () => {
      if (!productId) return;
      
      setLoading(true);
      try {
        const data = await dbService.getMovementsByProduct(productId);
        setMovements(data);
      } catch (error) {
        console.error("Error loading movements:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMovements();
  }, [productId]);

  return { movements, loading };
};

// Custom hook for low stock products
export const useLowStockProducts = () => {
  const { products } = useInventory();
  
  return products.filter(p => p.stock <= p.minStock);
};

// Custom hook for dashboard stats
export const useDashboardStats = () => {
  const { products, movements } = useInventory();
  
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const totalMovements = movements.length;
  
  const recentMovements = [...movements]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  
  return {
    totalProducts,
    totalValue,
    lowStockCount,
    totalMovements,
    recentMovements,
  };
};