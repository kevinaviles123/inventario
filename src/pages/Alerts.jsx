import React, { useMemo } from "react";
import { useInventory } from "../contexts/InventoryContext";

const Alerts = () => {
  const { products, categories } = useInventory();

  const lowStockProducts = useMemo(
    () => products.filter((p) => p.stock <= p.minStock),
    [products]
  );

  const getCategory = (categoryId) =>
    categories.find((c) => c.id === categoryId) || {
      name: "Sin categoría",
      color: "#9ca3af",
    };

  const getProgress = (product) => {
    if (!product.minStock || product.minStock <= 0) return 0;
    const ratio = product.stock / product.minStock;
    return Math.max(0, Math.min(ratio, 1)) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Alertas de bajo stock
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Productos cuyo stock actual está por debajo del umbral mínimo
            configurado.
          </p>
        </div>
        {lowStockProducts.length > 0 && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {lowStockProducts.length} alerta
            {lowStockProducts.length !== 1 && "s"}
          </span>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {lowStockProducts.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-gray-500">
              No hay productos con stock bajo en este momento.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {lowStockProducts.map((product) => {
              const category = getCategory(product.categoryId);
              const progress = getProgress(product);

              return (
                <div
                  key={product.id}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={product.image || "https://via.placeholder.com/40"}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                      <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs"
                        style={{
                          background: `${category.color}20`,
                          borderLeft: `3px solid ${category.color}`,
                        }}
                      >
                        <span className="mr-1 text-gray-700">
                          {category.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 max-w-sm">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Stock actual</span>
                      <span>
                        {product.stock} / {product.minStock}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${
                          progress < 50
                            ? "bg-red-500"
                            : progress < 80
                            ? "bg-amber-400"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-red-600">
                      Faltan {Math.max(product.minStock - product.stock, 0)}{" "}
                      unidades para alcanzar el mínimo.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;

