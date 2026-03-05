import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useInventory } from "../../contexts/InventoryContext";
import Button from "../Common/Button";
import Input from "../Common/Input";

const schema = yup.object({
  name: yup.string().required("El nombre es requerido").min(2, "Mínimo 2 caracteres"),
  color: yup.string().required("El color es requerido"),
});

const CategoryForm = ({ category, onClose }) => {
  const { addCategory, updateCategory } = useInventory();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: category || {
      name: "",
      color: "#4f46e5",
    },
  });

  const onSubmit = async (data) => {
    try {
      if (category) {
        await updateCategory(category.id, data);
      } else {
        await addCategory(data);
      }
      onClose();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nombre de la categoría"
        {...register("name")}
        error={errors.name?.message}
        placeholder="Ej: Electrónica, Ropa, Alimentos..."
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Color
        </label>
        <div className="flex items-center space-x-3">
          <input
            type="color"
            {...register("color")}
            className="h-10 w-20 rounded-md border border-gray-300 cursor-pointer"
          />
          <span className="text-sm text-gray-500">
            Selecciona un color para la categoría
          </span>
        </div>
        {errors.color && (
          <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {category ? "Actualizar" : "Guardar"}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;