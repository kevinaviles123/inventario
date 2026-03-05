import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";
import Modal from "../Common/Modal";
import Button from "../Common/Button";

const QRGenerator = ({ product, isOpen, onClose }) => {
  const canvasRef = useRef();

  useEffect(() => {
    if (product && canvasRef.current) {
      const qrData = JSON.stringify({
        id: product.id,
        sku: product.sku,
        name: product.name,
        price: product.price,
        stock: product.stock,
      });

      QRCode.toCanvas(canvasRef.current, qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      }, (error) => {
        if (error) console.error("Error generating QR:", error);
      });
    }
  }, [product]);

  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const win = window.open("");
    win.document.write(`
      <html>
        <head>
          <title>Código QR - ${product?.name}</title>
          <style>
            body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            img { max-width: 90%; height: auto; }
          </style>
        </head>
        <body>
          <img src="${canvas.toDataURL()}" />
          <script>window.print();</script>
        </body>
      </html>
    `);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Código QR del Producto" size="sm">
      {product && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <canvas ref={canvasRef} className="border rounded-lg" />
          </div>

          <div className="text-center">
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
          </div>

          <div className="flex justify-center space-x-3">
            <Button onClick={handlePrint}>
              Imprimir QR
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default QRGenerator;