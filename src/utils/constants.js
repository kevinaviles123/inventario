export const APP_NAME = "InventarioPro";
export const APP_VERSION = "1.0.0";

// Movement types
export const MOVEMENT_TYPES = {
  ENTRADA: "entrada",
  SALIDA: "salida",
};

export const MOVEMENT_TYPE_LABELS = {
  [MOVEMENT_TYPES.ENTRADA]: "Entrada",
  [MOVEMENT_TYPES.SALIDA]: "Salida",
};

export const MOVEMENT_TYPE_COLORS = {
  [MOVEMENT_TYPES.ENTRADA]: "success",
  [MOVEMENT_TYPES.SALIDA]: "danger",
};

// Product status
export const PRODUCT_STATUS = {
  IN_STOCK: "in_stock",
  LOW_STOCK: "low_stock",
  OUT_OF_STOCK: "out_of_stock",
};

export const PRODUCT_STATUS_LABELS = {
  [PRODUCT_STATUS.IN_STOCK]: "En stock",
  [PRODUCT_STATUS.LOW_STOCK]: "Stock bajo",
  [PRODUCT_STATUS.OUT_OF_STOCK]: "Sin stock",
};

export const PRODUCT_STATUS_COLORS = {
  [PRODUCT_STATUS.IN_STOCK]: "success",
  [PRODUCT_STATUS.LOW_STOCK]: "warning",
  [PRODUCT_STATUS.OUT_OF_STOCK]: "danger",
};

// Routes
export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PRODUCTS: "/products",
  CATEGORIES: "/categories",
  MOVEMENTS: "/movements",
  REPORTS: "/reports",
  OFFLINE: "/offline",
};

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  PRODUCTS: "/products",
  CATEGORIES: "/categories",
  MOVEMENTS: "/movements",
  REPORTS: "/reports",
  SYNC: "/sync",
};

// Local storage keys
export const STORAGE_KEYS = {
  USER: "user",
  THEME: "theme",
  OFFLINE_QUEUE: "offlineQueue",
  SYNC_STATUS: "syncStatus",
};

// Chart colors
export const CHART_COLORS = {
  primary: "#4f46e5",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  gray: "#6b7280",
};

// Default pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

// File upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

// QR Code
export const QR_CODE_SIZE = 200;
export const QR_CODE_MARGIN = 2;

// Warehouses
export const WAREHOUSES = ["Principal", "Secundario", "Bodega Norte"];

// Sync intervals (in milliseconds)
export const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes
export const BACKGROUND_SYNC_INTERVAL = 60 * 60 * 1000; // 1 hour

// Toast durations
export const TOAST_DURATION = 4000;
export const TOAST_DURATION_LONG = 7000;

// Animation durations
export const ANIMATION_DURATION = 300;

// Date formats
export const DATE_FORMATS = {
  SHORT: "dd/MM/yyyy",
  LONG: "dd/MM/yyyy HH:mm:ss",
  TIME: "HH:mm",
  MONTH_YEAR: "MMMM yyyy",
};

// Validation rules
export const VALIDATION = {
  MIN_PRODUCT_NAME: 2,
  MAX_PRODUCT_NAME: 100,
  MIN_SKU: 3,
  MAX_SKU: 50,
  MIN_PRICE: 0,
  MAX_PRICE: 9999999,
  MIN_STOCK: 0,
  MAX_STOCK: 999999,
  MIN_QTY: 1,
  MAX_QTY: 999999,
};

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED: "Este campo es requerido",
  INVALID_EMAIL: "Email inválido",
  INVALID_PASSWORD: "Contraseña inválida",
  PASSWORDS_DONT_MATCH: "Las contraseñas no coinciden",
  MIN_LENGTH: (min) => `Mínimo ${min} caracteres`,
  MAX_LENGTH: (max) => `Máximo ${max} caracteres`,
  INVALID_NUMBER: "Debe ser un número válido",
  MIN_VALUE: (min) => `Debe ser mayor o igual a ${min}`,
  MAX_VALUE: (max) => `Debe ser menor o igual a ${max}`,
  INVALID_FILE_TYPE: "Tipo de archivo no permitido",
  FILE_TOO_LARGE: (max) => `El archivo no debe superar los ${max}MB`,
  NETWORK_ERROR: "Error de conexión",
  SERVER_ERROR: "Error del servidor",
  UNAUTHORIZED: "No autorizado",
  FORBIDDEN: "Acceso denegado",
  NOT_FOUND: "No encontrado",
};