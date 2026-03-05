import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import Modal from "../Common/Modal";
import Button from "../Common/Button";
import { useInventory } from "../../contexts/InventoryContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const QRScanner = ({ isOpen, onClose }) => {
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [scannedProduct, setScannedProduct] = useState(null);
  const { products } = useInventory();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && !scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
          aspectRatio: 1.0,
        },
        false
      );

      scanner.render(onScanSuccess, onScanError);
      scannerRef.current = scanner;
      setScanning(true);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .clear()
          .catch(console.error)
          .finally(() => {
            scannerRef.current = null;
            setScanning(false);
          });
      }
    };
  }, [isOpen]);

  const onScanSuccess = (decodedText) => {
    try {
      const data = JSON.parse(decodedText);
      const product = products.find((p) => p.id === data.id || p.sku === data.sku);
      
      if (product) {
        toast.success(`Producto encontrado: ${product.name}`);
        setScannedProduct(product);
      } else {
        toast.error("Producto no encontrado");
      }
    } catch (error) {
      // Si no es JSON, buscar por SKU directamente
      const product = products.find((p) => p.sku === decodedText);
      if (product) {
        toast.success(`Producto encontrado: ${product.name}`);
        setScannedProduct(product);
      } else {
        toast.error("Formato de QR inválido");
      }
    }
  };

  const onScanError = (error) => {
    console.warn("Scan error:", error);
  };

  const handleClose = async () => {
    if (scannerRef.current) {
      await scannerRef.current.clear();
      scannerRef.current = null;
    }
    setScanning(false);
    setScannedProduct(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Escanear Código QR">
      <div className="space-y-4">
        <div id="qr-reader" className="w-full"></div>
        
        {!scanning && !scannedProduct && (
          <div className="text-center py-8">
            <p className="text-gray-500">Inicializando cámara...</p>
          </div>
        )}

        {scannedProduct && (
          <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Producto escaneado
            </h3>
            <div className="flex items-center space-x-4">
              <img
                src={scannedProduct.image || "https://via.placeholder.com/40"}
                alt={scannedProduct.name}
                className="h-12 w-12 rounded-lg object-cover"
              />
              <div className="text-sm">
                <p className="font-medium text-gray-900">
                  {scannedProduct.name}
                </p>
                <p className="text-gray-500 text-xs">
                  SKU: {scannedProduct.sku}
                </p>
                <p className="text-gray-500 text-xs">
                  Precio: ${scannedProduct.price} • Stock: {scannedProduct.stock}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setScannedProduct(null)}
              >
                Escanear otro
              </Button>
              <Button
                onClick={() => {
                  navigate(`/products?edit=${scannedProduct.id}`);
                  handleClose();
                }}
              >
                Ver / editar producto
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default QRScanner;