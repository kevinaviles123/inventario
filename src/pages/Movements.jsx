import React, { useMemo, useState } from "react";
import { useInventory } from "../contexts/InventoryContext";
import Button from "../components/Common/Button";
import Modal from "../components/Common/Modal";
import { formatDate } from "../utils/helpers";
import { HiOutlinePlus, HiOutlineArrowDown, HiOutlineArrowUp } from "react-icons/hi";
import MovementForm from "../components/Movements/MovementForm";
import { WAREHOUSES } from "../utils/constants";

const Movements = () => {
  const { movements, products } = useInventory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    productId: "",
    warehouse: "",
  });


  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : "Producto desconocido";
  };

  const sortedMovements = useMemo(
    () =>
      movements
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [movements]
  );

  const filteredMovements = useMemo(
    () =>
      sortedMovements.filter((movement) => {
        if (filters.type !== "all" && movement.type !== filters.type) {
          return false;
        }

        if (
          filters.productId &&
          String(movement.productId) !== String(filters.productId)
        ) {
          return false;
        }

        if (filters.warehouse && movement.warehouse !== filters.warehouse) {
          return false;
        }

        return true;
      }),
    [sortedMovements, filters]
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Movimientos de Stock</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <HiOutlinePlus className="h-5 w-5 mr-2" />
          Nuevo Movimiento
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 space-y-3 md:flex md:items-center md:justify-between md:space-y-0">
          <div className="text-sm font-medium text-gray-700">
            Filtros
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
            <select
              className="input-field"
              value={filters.type}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, type: e.target.value }))
              }
            >
              <option value="all">Todos los tipos</option>
              <option value="entrada">Solo entradas</option>
              <option value="salida">Solo salidas</option>
            </select>

            <select
              className="input-field"
              value={filters.productId}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, productId: e.target.value }))
              }
            >
              <option value="">Todos los productos</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>

            <select
              className="input-field"
              value={filters.warehouse}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, warehouse: e.target.value }))
              }
            >
              <option value="">Todos los almacenes</option>
              {WAREHOUSES.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Almacén
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMovements.map((movement) => (
                <tr key={movement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(movement.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {getProductName(movement.productId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                        movement.type === "entrada"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {movement.type === "entrada" ? (
                        <HiOutlineArrowDown className="mr-1 h-3 w-3" />
                      ) : (
                        <HiOutlineArrowUp className="mr-1 h-3 w-3" />
                      )}
                      {movement.type === "entrada" ? "Entrada" : "Salida"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {movement.qty}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {movement.reason || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {movement.warehouse || "-"}
                  </td>
                </tr>
              ))}

              {filteredMovements.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No hay movimientos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Movimiento"
      >
        <MovementForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Movements;