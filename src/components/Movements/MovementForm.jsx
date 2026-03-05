import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useInventory } from "../../contexts/InventoryContext";
import Button from "../Common/Button";
import Input from "../Common/Input";
import { WAREHOUSES } from "../../utils/constants";

const schema = yup.object({
  productId: yup.string().required("Debe seleccionar un producto"),
  type: yup.string().required("Debe seleccionar un tipo"),
  qty: yup.number()
    .required("La cantidad es requerida")
    .positive("Debe ser positiva")
    .integer("Debe ser un número entero"),
  warehouse: yup.string().required("Debe seleccionar un almacén"),
  date: yup.string().required("La fecha es requerida"),
  reason: yup.string().nullable(),
});

const MovementForm = ({ onClose }) => {
  const { products, addMovement } = useInventory();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: "entrada",
      qty: 1,
       warehouse: WAREHOUSES[0],
       date: new Date().toISOString().slice(0, 16),
    },
  });

  const selectedProductId = watch("productId");
  const selectedProduct = products.find(p => p.id === selectedProductId);
  const movementType = watch("type");

  const onSubmit = async (data) => {
    try {
      await addMovement(data);
      onClose();
    } catch (error) {
      console.error("Error adding movement:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Producto
        </label>
        <select
          {...register("productId")}
          className="input-field"
        >
          <option value="">Seleccionar producto</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} (Stock: {product.stock})
            </option>
          ))}
        </select>
        {errors.productId && (
          <p className="mt-1 text-sm text-red-600">{errors.productId.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            {...register("type")}
            className="input-field"
          >
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
        </div>

        <Input
          label="Cantidad"
          type="number"
          {...register("qty")}
          error={errors.qty?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Almacén
          </label>
          <select
            {...register("warehouse")}
            className="input-field"
          >
            <option value="">Seleccionar almacén</option>
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

        <Input
          label="Fecha"
          type="datetime-local"
          {...register("date")}
          error={errors.date?.message}
        />
      </div>

      {selectedProduct && movementType === "salida" && (
        <div className={`p-3 rounded-md ${
          selectedProduct.stock < watch("qty")
            ? "bg-red-50 text-red-700"
            : "bg-green-50 text-green-700"
        }`}>
          Stock disponible: {selectedProduct.stock} unidades
        </div>
      )}

      <Input
        label="Motivo (opcional)"
        {...register("reason")}
        placeholder="Ej: Venta, reposición, ajuste..."
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          loading={isSubmitting}
          disabled={movementType === "salida" && selectedProduct?.stock < watch("qty")}
        >
          Registrar
        </Button>
      </div>
    </form>
  );
};

export default MovementForm;