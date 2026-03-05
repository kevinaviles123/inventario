import React, { useMemo } from "react";
import { useInventory } from "../contexts/InventoryContext";
import Button from "../components/Common/Button";
import { downloadCSV, formatCurrency } from "../utils/helpers";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import {
  HiOutlineDownload,
  HiOutlineCube,
  HiOutlineCurrencyDollar,
  HiOutlineSwitchHorizontal,
} from "react-icons/hi";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Reports = () => {
  const { products, movements, categories } = useInventory();

  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const totalEntradas = movements.filter(m => m.type === "entrada").length;
  const totalSalidas = movements.filter(m => m.type === "salida").length;
  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  const categoriesWithData = useMemo(
    () =>
      categories.map((cat) => ({
        ...cat,
        products: products.filter(
          (p) => String(p.categoryId) === String(cat.id)
        ),
      })),
    [categories, products]
  );

  const movementsByCategory = useMemo(() => {
    const result = {};
    categories.forEach((cat) => {
      result[cat.id] = { entrada: 0, salida: 0, name: cat.name };
    });

    movements.forEach((m) => {
      const product = products.find(
        (p) => String(p.id) === String(m.productId)
      );
      if (!product || !product.categoryId) return;

      const entry = result[product.categoryId] || {
        entrada: 0,
        salida: 0,
        name:
          categories.find((c) => c.id === product.categoryId)?.name ||
          "Sin categoría",
      };

      if (m.type === "entrada") {
        entry.entrada += Number(m.qty) || 0;
      } else if (m.type === "salida") {
        entry.salida += Number(m.qty) || 0;
      }

      result[product.categoryId] = entry;
    });

    const labels = Object.values(result).map((r) => r.name);
    const entradas = Object.values(result).map((r) => r.entrada);
    const salidas = Object.values(result).map((r) => r.salida);

    return {
      labels,
      entradas,
      salidas,
    };
  }, [movements, products, categories]);

  const stockByCategory = useMemo(() => {
    const result = {};
    categories.forEach((cat) => {
      result[cat.id] = {
        name: cat.name,
        value: 0,
      };
    });

    products.forEach((p) => {
      if (!p.categoryId) return;
      const entry = result[p.categoryId] || {
        name:
          categories.find((c) => c.id === p.categoryId)?.name ||
          "Sin categoría",
        value: 0,
      };
      entry.value += (p.price || 0) * (p.stock || 0);
      result[p.categoryId] = entry;
    });

    const entries = Object.values(result);
    return {
      labels: entries.map((e) => e.name),
      values: entries.map((e) => e.value),
    };
  }, [products, categories]);

  const topSoldProducts = useMemo(() => {
    const salesMap = {};
    movements
      .filter((m) => m.type === "salida")
      .forEach((m) => {
        const key = m.productId;
        salesMap[key] = (salesMap[key] || 0) + (Number(m.qty) || 0);
      });

    const enriched = Object.entries(salesMap)
      .map(([productId, totalQty]) => {
        const product = products.find(
          (p) => String(p.id) === String(productId)
        );
        if (!product) return null;
        return {
          product,
          totalQty,
          totalValue: (product.price || 0) * totalQty,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.totalQty - a.totalQty)
      .slice(0, 10);

    return enriched;
  }, [movements, products]);

  const stockValueByCategory = useMemo(
    () =>
      categoriesWithData.map((cat) => {
        const units = cat.products.reduce(
          (sum, p) => sum + (p.stock || 0),
          0
        );
        const value = cat.products.reduce(
          (sum, p) => sum + (p.price || 0) * (p.stock || 0),
          0
        );
        return {
          id: cat.id,
          name: cat.name,
          units,
          value,
        };
      }),
    [categoriesWithData]
  );

  const exportProductsCSV = () => {
    const data = products.map(p => ({
      Nombre: p.name,
      SKU: p.sku,
      Categoría: p.categoryId,
      Precio: p.price,
      Stock: p.stock,
      "Umbral Mínimo": p.minStock,
      "Valor Total": p.price * p.stock,
    }));
    downloadCSV(data, "productos.csv");
  };

  const exportMovementsCSV = () => {
    const data = movements.map(m => ({
      Fecha: new Date(m.date).toLocaleString(),
      Producto: products.find(p => p.id === m.productId)?.name || "Desconocido",
      Tipo: m.type === "entrada" ? "Entrada" : "Salida",
      Cantidad: m.qty,
      Motivo: m.reason || "",
    }));
    downloadCSV(data, "movimientos.csv");
  };

  const exportLowStockCSV = () => {
    const data = lowStockProducts.map(p => ({
      Nombre: p.name,
      SKU: p.sku,
      Stock: p.stock,
      "Umbral Mínimo": p.minStock,
      "Stock Necesario": p.minStock - p.stock,
    }));
    downloadCSV(data, "productos_bajo_stock.csv");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Reportes</h1>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Total del Inventario</p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {formatCurrency(totalValue)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <HiOutlineCurrencyDollar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Productos</p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {products.length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <HiOutlineCube className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Movimientos</p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {movements.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Entradas: {totalEntradas} | Salidas: {totalSalidas}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <HiOutlineSwitchHorizontal className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Alertas */}
      {lowStockProducts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">
            ⚠️ Productos con stock bajo ({lowStockProducts.length})
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {lowStockProducts.slice(0, 5).map(p => (
              <li key={p.id} className="text-sm text-yellow-700">
                {p.name} - Stock: {p.stock} (Mínimo: {p.minStock})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gráfico de barras: movimientos por categoría */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Movimientos por categoría
        </h2>
        {movements.length === 0 ? (
          <p className="text-sm text-gray-500">
            Aún no hay movimientos registrados.
          </p>
        ) : (
          <Bar
            data={{
              labels: movementsByCategory.labels,
              datasets: [
                {
                  label: "Entradas",
                  data: movementsByCategory.entradas,
                  backgroundColor: "rgba(34,197,94,0.6)",
                },
                {
                  label: "Salidas",
                  data: movementsByCategory.salidas,
                  backgroundColor: "rgba(239,68,68,0.6)",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0,
                  },
                  title: {
                    display: true,
                    text: "Unidades",
                  },
                },
              },
            }}
          />
        )}
      </div>

      {/* Gráfico de torta: distribución de stock por categoría */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Distribución del valor de stock por categoría
        </h2>
        {products.length === 0 ? (
          <p className="text-sm text-gray-500">
            Aún no hay productos registrados.
          </p>
        ) : (
          <Pie
            data={{
              labels: stockByCategory.labels,
              datasets: [
                {
                  data: stockByCategory.values,
                  backgroundColor: [
                    "#4f46e5",
                    "#22c55e",
                    "#f97316",
                    "#0ea5e9",
                    "#e11d48",
                    "#6b7280",
                    "#14b8a6",
                    "#a855f7",
                  ],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "bottom",
                },
              },
            }}
          />
        )}
      </div>

      {/* Tabla resumen: productos más vendidos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Productos más vendidos (por salidas)
        </h2>
        {topSoldProducts.length === 0 ? (
          <p className="text-sm text-gray-500">
            No hay movimientos de salida registrados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unidades vendidas
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor total estimado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topSoldProducts.map((item) => (
                  <tr key={item.product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {item.product.name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {item.product.sku}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {item.totalQty}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.totalValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tabla resumen: valor de stock por categoría */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Valor de stock por categoría
        </h2>
        {stockValueByCategory.length === 0 ? (
          <p className="text-sm text-gray-500">
            No hay datos de categorías / productos disponibles.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Productos
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unidades
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stockValueByCategory.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {row.name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {
                        categoriesWithData.find((c) => c.id === row.id)
                          ?.products.length
                      }
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {row.units}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(row.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Exportar datos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Exportar Datos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={exportProductsCSV}>
            <HiOutlineDownload className="h-5 w-5 mr-2" />
            Productos
          </Button>
          
          <Button onClick={exportMovementsCSV}>
            <HiOutlineDownload className="h-5 w-5 mr-2" />
            Movimientos
          </Button>
          
          {lowStockProducts.length > 0 && (
            <Button onClick={exportLowStockCSV}>
              <HiOutlineDownload className="h-5 w-5 mr-2" />
              Bajo Stock
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;