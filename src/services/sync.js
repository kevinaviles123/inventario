import { dbService } from "./db";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const syncService = {
  async syncAll() {
    try {
      const pendingItems = await dbService.getPendingSync();
      
      for (const item of pendingItems) {
        await this.syncItem(item);
      }
      
      return { success: true, count: pendingItems.length };
    } catch (error) {
      console.error("Sync error:", error);
      return { success: false, error: error.message };
    }
  },

  async syncItem(item) {
    try {
      let response;
      
      switch (item.table) {
        case "products":
          response = await this.syncProduct(item);
          break;
        case "categories":
          response = await this.syncCategory(item);
          break;
        case "movements":
          response = await this.syncMovement(item);
          break;
        default:
          throw new Error(`Unknown table: ${item.table}`);
      }
      
      if (response && response.data) {
        await dbService.updateSyncedItem(item.id, response.data);
      }
      
      return response;
    } catch (error) {
      console.error(`Error syncing item ${item.id}:`, error);
      throw error;
    }
  },

  async syncProduct(item) {
    switch (item.operation) {
      case "add":
        return await axios.post(`${API_URL}/products`, item.data);
      case "update":
        return await axios.put(`${API_URL}/products/${item.data.id}`, item.data);
      case "delete":
        return await axios.delete(`${API_URL}/products/${item.data.id}`);
      default:
        throw new Error(`Unknown operation: ${item.operation}`);
    }
  },

  async syncCategory(item) {
    switch (item.operation) {
      case "add":
        return await axios.post(`${API_URL}/categories`, item.data);
      case "update":
        return await axios.put(`${API_URL}/categories/${item.data.id}`, item.data);
      case "delete":
        return await axios.delete(`${API_URL}/categories/${item.data.id}`);
      default:
        throw new Error(`Unknown operation: ${item.operation}`);
    }
  },

  async syncMovement(item) {
    if (item.operation === "add") {
      return await axios.post(`${API_URL}/movements`, item.data);
    }
    throw new Error(`Unknown operation: ${item.operation}`);
  },

  // Download data from server
  async downloadData() {
    try {
      const [products, categories, movements] = await Promise.all([
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/categories`),
        axios.get(`${API_URL}/movements`),
      ]);
      
      // Clear existing data
      await dbService.clearAll();
      
      // Save to local DB
      for (const product of products.data) {
        await dbService.addProduct({ ...product, syncStatus: "synced" });
      }
      
      for (const category of categories.data) {
        await dbService.addCategory({ ...category, syncStatus: "synced" });
      }
      
      for (const movement of movements.data) {
        await dbService.addMovement({ ...movement, syncStatus: "synced" });
      }
      
      return { success: true };
    } catch (error) {
      console.error("Download error:", error);
      return { success: false, error: error.message };
    }
  },
};