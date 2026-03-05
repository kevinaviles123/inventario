import React, { useState } from "react";
import Button from "../Common/Button";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineQrcode } from "react-icons/hi";
import QRGenerator from "../QR/QRGenerator";

const ProductList = ({ products, categories, onEdit, onDelete }) => {
  const [qrProduct, setQrProduct] = useState(null);

  const getCategory = (categoryId) => {
    return categories.find((c) => c.id === categoryId) || { name: "Sin categoría", color: "#9ca3af" };
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imagen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Umbral
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => {
                const category = getCategory(product.categoryId);
                const isLowStock = product.stock <= product.minStock;
                
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.image || "https://via.placeholder.com/40"}
                        alt={product.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="px-2 py-1 text-xs rounded-full"
                        style={{
                          background: `${category.color}20`,
                          color: "#1f2937",
                          borderLeft: `3px solid ${category.color}`,
                        }}
                      >
                        {category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            isLowStock
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {product.stock}
                        </span>
                        {isLowStock && (
                          <span className="px-2 py-0.5 text-[11px] rounded-full bg-red-50 text-red-700 border border-red-200">
                            Bajo stock
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.minStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(product)}
                        className="mr-2"
                      >
                        <HiOutlinePencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQrProduct(product)}
                        className="mr-2 text-green-600 hover:text-green-700"
                      >
                        <HiOutlineQrcode className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <HiOutlineTrash className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay productos para mostrar</p>
            </div>
          )}
        </div>
      </div>

      <QRGenerator
        product={qrProduct}
        isOpen={!!qrProduct}
        onClose={() => setQrProduct(null)}
      />
    </>
  );
};

export default ProductList;