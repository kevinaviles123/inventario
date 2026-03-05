import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useInventory } from "../../contexts/InventoryContext";
import Button from "../Common/Button";
import Input from "../Common/Input";
import { HiChevronDown } from "react-icons/hi";
import { WAREHOUSES } from "../../utils/constants";

const schema = yup.object({
  name: yup.string().required("El nombre es requerido").min(2, "Mínimo 2 caracteres"),
  sku: yup.string().required("El SKU es requerido"),
  categoryId: yup.string().required("La categoría es requerida"),
  price: yup.number().required("El precio es requerido").positive("Debe ser positivo"),
  stock: yup.number().required("El stock es requerido").min(0, "No puede ser negativo"),
  minStock: yup.number().required("El umbral es requerido").min(0, "No puede ser negativo"),
  image: yup.string().url("Debe ser una URL válida").nullable(),
  warehouse: yup.string().required("El almacén es requerido"),
});

const ProductForm = ({ product, categories, onClose }) => {
  const { addProduct, updateProduct } = useInventory();
  
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: product || {
      name: "",
      sku: "",
      categoryId: "",
      price: 0,
      stock: 0,
      minStock: 5,
      image: "",
      warehouse: WAREHOUSES[0],
    },
  });

  const [catOpen, setCatOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedCategoryId = watch("categoryId");
  const selectedCategory = categories.find(
    (cat) => String(cat.id) === String(selectedCategoryId)
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCatOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSubmit = async (data) => {
    try {
      if (product) {
        await updateProduct(product.id, data);
      } else {
        await addProduct(data);
      }
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nombre"
        {...register("name")}
        error={errors.name?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="SKU"
          {...register("sku")}
          error={errors.sku?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setCatOpen((open) => !open)}
              className="w-full flex items-center justify-between px-4 py-2.5 
                         bg-white border border-gray-300 rounded-lg text-sm 
                         text-gray-700 hover:border-indigo-500 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                {selectedCategory ? (
                  <>
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: selectedCategory.color }}
                    />
                    <span>{selectedCategory.name}</span>
                  </>
                ) : (
                  <span className="text-gray-400">Seleccionar categoría</span>
                )}
              </div>
              <HiChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  catOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {catOpen && (
              <div
                className="absolute z-50 w-full mt-1 bg-white border 
                           border-gray-200 rounded-lg shadow-xl 
                           max-h-52 overflow-y-auto"
              >
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setValue("categoryId", cat.id);
                      setCatOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 
                               text-sm text-gray-700 hover:bg-indigo-50 
                               hover:text-indigo-600 transition-colors
                               first:rounded-t-lg last:rounded-b-lg"
                  >
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Input
          label="Precio"
          type="number"
          step="0.01"
          {...register("price")}
          error={errors.price?.message}
        />

        <Input
          label="Stock"
          type="number"
          {...register("stock")}
          error={errors.stock?.message}
        />

        <Input
          label="Umbral mínimo"
          type="number"
          {...register("minStock")}
          error={errors.minStock?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Almacén
          </label>
          <select
            className="input-field"
            {...register("warehouse")}
          >
            {WAREHOUSES.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
          {errors.warehouse && (
            <p className="mt-1 text-sm text-red-600">
              {errors.warehouse.message}
            </p>
          )}
        </div>
      </div>

      <Input
        label="URL de imagen (opcional)"
        {...register("image")}
        error={errors.image?.message}
        placeholder="https://ejemplo.com/imagen.jpg"
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {product ? "Actualizar" : "Guardar"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;