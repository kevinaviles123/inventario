import React, { useState, useMemo, useEffect } from "react";
import { useInventory } from "../contexts/InventoryContext";
import ProductList from "../components/Products/ProductList";
import ProductFilters from "../components/Products/ProductFilters";
import ProductForm from "../components/Products/ProductForm";
import Button from "../components/Common/Button";
import Modal from "../components/Common/Modal";
import { HiOutlinePlus } from "react-icons/hi";
import { useSearchParams } from "react-router-dom";

const Products = () => {
  const [searchParams] = useSearchParams();
  const { products, categories, deleteProduct } = useInventory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    lowStock: searchParams.get("filter") === "lowstock",
    warehouse: "",
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      if (
        filters.search &&
        !product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !product.sku.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      
      // Category filter (normalizamos a string para evitar problemas de tipo)
      if (
        filters.category &&
        String(product.categoryId) !== String(filters.category)
      ) {
        return false;
      }
      
      // Low stock filter
      if (filters.lowStock && product.stock > product.minStock) {
        return false;
      }

      // Warehouse filter
      if (filters.warehouse && product.warehouse !== filters.warehouse) {
        return false;
      }
      
      return true;
    });
  }, [products, filters]);

  // Permitir abrir directamente un producto en modo edición vía query param ?edit=ID
  useEffect(() => {
    const editId = searchParams.get("edit");
    if (!editId) return;

    const productToEdit = products.find(
      (p) => String(p.id) === String(editId)
    );

    if (productToEdit) {
      setEditingProduct(productToEdit);
      setIsModalOpen(true);
    }
  }, [searchParams, products]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId) => {
    const product = products.find((p) => p.id === productId);
    const name = product?.name || "este producto";
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar "${name}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    await deleteProduct(productId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Productos</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <HiOutlinePlus className="h-5 w-5 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <ProductFilters filters={filters} onFilterChange={setFilters} />

      <ProductList
        products={filteredProducts}
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? "Editar Producto" : "Nuevo Producto"}
      >
        <ProductForm
          product={editingProduct}
          categories={categories}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default Products;