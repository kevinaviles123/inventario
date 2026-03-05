import React, { useState } from "react";
import { useInventory } from "../contexts/InventoryContext";
import Button from "../components/Common/Button";
import Modal from "../components/Common/Modal";
import Input from "../components/Common/Input";
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";

const Categories = () => {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useInventory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", color: "#4f46e5" });

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, color: category.color });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", color: "#4f46e5" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await addCategory(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
      await deleteCategory(id);
    }
  };

  const getProductCount = (categoryId) =>
    products.filter((p) => String(p.categoryId) === String(categoryId)).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Categorías</h1>
        <Button onClick={() => handleOpenModal()}>
          <HiOutlinePlus className="h-5 w-5 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <div>
                <span className="block font-medium text-gray-900">
                  {category.name}
                </span>
                <span className="block text-xs text-gray-500">
                  {getProductCount(category.id)}{" "}
                  {getProductCount(category.id) === 1
                    ? "producto"
                    : "productos"}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOpenModal(category)}
              >
                <HiOutlinePencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(category.id)}
                className="text-red-600 hover:text-red-700"
              >
                <HiOutlineTrash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No hay categorías creadas</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Editar Categoría" : "Nueva Categoría"}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full h-10 rounded-md border border-gray-300"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {editingCategory ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;