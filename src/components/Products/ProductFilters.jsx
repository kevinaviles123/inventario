import React from "react";
import { useInventory } from "../../contexts/InventoryContext";
import Input from "../Common/Input";
import { HiOutlineSearch } from "react-icons/hi";
import { WAREHOUSES } from "../../utils/constants";

const ProductFilters = ({ filters, onFilterChange }) => {
  const { categories } = useInventory();

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2">
          <Input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            icon={<HiOutlineSearch />}
          />
        </div>

        <div>
          <select
            className="input-field"
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            className="input-field"
            value={filters.lowStock ? "low" : "all"}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              lowStock: e.target.value === "low" 
            })}
          >
            <option value="all">Todos los productos</option>
            <option value="low">Solo bajo stock</option>
          </select>
        </div>

        <div>
          <select
            className="input-field"
            value={filters.warehouse || ""}
            onChange={(e) =>
              onFilterChange({ ...filters, warehouse: e.target.value })
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
    </div>
  );
};

export default ProductFilters;