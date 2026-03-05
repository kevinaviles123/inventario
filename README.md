# InventarioPro - PWA de Gestión de Inventario

Aplicación Progressive Web App (PWA) para gestión de inventario en pequeños negocios. Funciona offline y se puede instalar en dispositivos móviles.

## Características

- ✅ Funciona sin conexión a internet
- ✅ Instalable en móviles y desktop
- ✅ Escáner de códigos QR
- ✅ Gestión completa de productos
- ✅ Control de stock en tiempo real
- ✅ Alertas de bajo inventario
- ✅ Reportes y exportación de datos
- ✅ Interfaz responsiva

## Tecnologías

- React 18
- Tailwind CSS
- Dexie (IndexedDB)
- Workbox (Service Workers)
- Chart.js
- HTML5-QRCode

## Instalación

```bash
# Clonar repositorio
git clone https://github.com/tuusuario/inventario-pwa.git

# Instalar dependencias
cd inventario-pwa
npm install

# Iniciar en desarrollo
npm start

# Construir para producción
npm run build

# Servir build localmente
npx serve -s build