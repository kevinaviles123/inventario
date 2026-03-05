import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { es } from "date-fns/locale";

// Format currency
export const formatCurrency = (value) => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(value);
};

// Format date
export const formatDate = (date) => {
  return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es });
};

// Format relative time
export const formatRelativeTime = (date) => {
  return formatDistance(new Date(date), new Date(), {
    addSuffix: true,
    locale: es,
  });
};

// Generate SKU
export const generateSKU = (productName, categoryId) => {
  const prefix = productName.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}-${categoryId}-${timestamp}`;
};

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Group by function
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

// Calculate stock value
export const calculateStockValue = (products) => {
  return products.reduce((total, product) => total + (product.price * product.stock), 0);
};

// Download CSV
export const downloadCSV = (data, filename) => {
  const csvContent = data.map(row => 
    Object.values(row).map(value => 
      typeof value === "string" ? `"${value}"` : value
    ).join(",")
  ).join("\n");
  
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Truncate text
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Get initials from name
export const getInitials = (name) => {
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// Random color generator
export const getRandomColor = () => {
  const colors = [
    "#4f46e5", "#2563eb", "#7c3aed", "#db2777", "#dc2626",
    "#ea580c", "#65a30d", "#059669", "#0891b2", "#6b7280"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Check if object is empty
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};