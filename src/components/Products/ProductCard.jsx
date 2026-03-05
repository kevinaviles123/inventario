import React from "react";
import Button from "../Common/Button";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineQrcode } from "react-icons/hi";

const ProductCard = ({ product, category, onEdit, onDelete, onShowQR }) => {
  const isLowStock = product.stock <= product.minStock;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <img
            src={product.image || "https://via.placeholder.com/60"}
            alt={product.name}
            className="h-16 w-16 rounded-lg object-cover"
          />
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
            
            <div className="flex items-center mt-1 space-x-2">
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
              
              <span className={`px-2 py-1 text-xs rounded-full ${
                isLowStock ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
              }`}>
                Stock: {product.stock}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Precio</p>
            <p className="text-lg font-bold text-gray-900">${product.price}</p>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(product)}>
              <HiOutlinePencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onShowQR(product)}
              className="text-green-600 hover:text-green-700"
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
          </div>
        </div>

        {isLowStock && (
          <div className="mt-3 p-2 bg-red-50 rounded-md">
            <p className="text-xs text-red-600 flex items-center">
              <span className="font-medium">¡Alerta!</span>
              <span className="ml-1">Stock bajo (mínimo: {product.minStock})</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;