import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useInventory } from "../contexts/InventoryContext";
import { formatCurrency } from "../utils/helpers";
import {
  HiOutlineCube,
  HiOutlineSwitchHorizontal,
  HiOutlineExclamation,
  HiOutlineCurrencyDollar,
} from "react-icons/hi";
import { WAREHOUSES } from "../utils/constants";

const Dashboard = () => {
  const { products, categories, movements } = useInventory();

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;

  const recentMovements = movements
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const chartMovements = movements
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 20);

  const entradasCount = chartMovements.filter(
    (m) => m.type === "entrada"
  ).length;
  const salidasCount = chartMovements.filter(
    (m) => m.type === "salida"
  ).length;
  const maxChartCount = Math.max(entradasCount, salidasCount, 1);

  const warehouseStats = useMemo(
    () =>
      WAREHOUSES.map((wh) => {
        const whProducts = products.filter((p) => p.warehouse === wh);
        const totalUnits = whProducts.reduce(
          (sum, p) => sum + (p.stock || 0),
          0
        );
        const totalValueWh = whProducts.reduce(
          (sum, p) => sum + (p.price || 0) * (p.stock || 0),
          0
        );
        return {
          name: wh,
          products: whProducts.length,
          units: totalUnits,
          value: totalValueWh,
        };
      }),
    [products]
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Resumen general</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <div className="p-3 rounded-full bg-indigo-100">
            <HiOutlineCube className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Total de productos</p>
            <p className="text-xl font-semibold text-gray-900">
              {products.length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <div className="p-3 rounded-full bg-emerald-100">
            <HiOutlineCurrencyDollar className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Valor total del stock</p>
            <p className="text-xl font-semibold text-gray-900">
              {formatCurrency(totalValue)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <div className="p-3 rounded-full bg-sky-100">
            <HiOutlineSwitchHorizontal className="h-6 w-6 text-sky-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Total de movimientos</p>
            <p className="text-xl font-semibold text-gray-900">
              {movements.length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <div className="p-3 rounded-full bg-amber-100">
            <HiOutlineExclamation className="h-6 w-6 text-amber-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Bajo stock</p>
            <p className="text-xl font-semibold text-gray-900">
              {lowStockCount}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Gráfico de movimientos recientes
            </h2>
            {movements.length === 0 ? (
              <p className="text-sm text-gray-500">
                No hay movimientos registrados todavía.
              </p>
            ) : (
              <div className="h-48 flex items-end space-x-6">
                <div className="flex-1 flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-1">Entradas</div>
                  <div className="flex-1 flex items-end w-full">
                    <div
                      className="w-full rounded-t-md bg-green-500"
                      style={{
                        height: `${(entradasCount / maxChartCount) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="mt-2 text-sm font-semibold text-gray-700">
                    {entradasCount}
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-1">Salidas</div>
                  <div className="flex-1 flex items-end w-full">
                    <div
                      className="w-full rounded-t-md bg-red-500"
                      style={{
                        height: `${(salidasCount / maxChartCount) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="mt-2 text-sm font-semibold text-gray-700">
                    {salidasCount}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Actividad reciente (últimos 5 movimientos)
            </h2>
            {recentMovements.length === 0 ? (
              <p className="text-sm text-gray-500">
                No hay movimientos registrados todavía.
              </p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {recentMovements.map((m) => (
                  <li
                    key={m.id}
                    className="py-3 flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-700">
                      {new Date(m.date).toLocaleString()}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        m.type === "entrada"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {m.type === "entrada" ? "Entrada" : "Salida"} • {m.qty}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Alertas de bajo stock
          </h2>
          <p className="text-3xl font-bold text-gray-900">{lowStockCount}</p>
          <p className="mt-2 text-sm text-gray-500">
            Productos cuyo stock está por debajo del umbral mínimo.
          </p>
          <Link
            to="/alerts"
            className="inline-flex items-center mt-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Ver productos con bajo stock
          </Link>
        </div>
      </div>

      {/* Métricas por almacén */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Métricas por almacén
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Almacén
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
              {warehouseStats.map((row) => (
                <tr key={row.name} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    {row.name}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    {row.products}
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
      </div>
    </div>
  );
};

export default Dashboard;

