
import { Product, User } from "../types";

const API_BASE = "http://localhost:8000/api";

/**
 * LocalMockDB: Mimics the Django Backend behavior in-browser 
 * when the Python server is not reachable.
 */
class LocalMockDB {
  private static STORAGE_KEY = 'nexus_mock_db';

  private static getStore() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : { products: [], users: [] };
  }

  private static saveStore(store: any) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(store));
  }

  static getProducts(): Product[] {
    return this.getStore().products;
  }

  static addProduct(product: Partial<Product>): Product {
    const store = this.getStore();
    const newProd = {
      ...product,
      id: `mock_${Date.now()}`,
      sellerName: product.sellerName || "Local User",
      likedBy: [],
      likes: 0,
      shares: 0,
      comments: [],
      created_at: new Date().toISOString()
    } as Product;
    
    store.products.unshift(newProd);
    this.saveStore(store);
    return newProd;
  }

  static mockLogin(username: string): User {
    return {
      id: '999',
      name: username,
      avatar: `https://picsum.photos/seed/${username}/200`,
      college: 'Nexus Local Node',
      isVerified: true
    };
  }
}

export const api = {
  // Check if backend is alive with a quick timeout
  async isBackendUp(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      const response = await fetch(`${API_BASE}/products/`, { 
        method: 'OPTIONS', 
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      return response.ok || response.status === 200;
    } catch (e) {
      return false;
    }
  },

  async getProducts(): Promise<Product[]> {
    const isUp = await this.isBackendUp();
    
    if (!isUp) {
      console.info("Nexus: 🛰️ Django Backend Offline. Switching to Local Node.");
      return LocalMockDB.getProducts();
    }

    try {
      const response = await fetch(`${API_BASE}/products/`);
      const data = await response.json();
      return data.map((item: any) => ({
        ...item,
        sellerName: item.seller_name,
        likedBy: [],
        likes: 0,
        shares: 0,
        comments: item.comments || []
      }));
    } catch (e) {
      return LocalMockDB.getProducts();
    }
  },

  async createProduct(product: Partial<Product>): Promise<Product | null> {
    const isUp = await this.isBackendUp();

    if (!isUp) {
      return LocalMockDB.addProduct(product);
    }

    try {
      const response = await fetch(`${API_BASE}/products/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      return await response.json();
    } catch (e) {
      return LocalMockDB.addProduct(product);
    }
  },

  async login(username: string): Promise<User | null> {
    const isUp = await this.isBackendUp();

    if (!isUp) {
      return LocalMockDB.mockLogin(username);
    }

    try {
      const response = await fetch(`${API_BASE}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      if (!response.ok) return null;
      const data = await response.json();
      return {
        id: data.id.toString(),
        name: data.username,
        avatar: data.avatar || `https://picsum.photos/seed/${data.username}/200`,
        college: data.college,
        isVerified: true
      };
    } catch (e) {
      return LocalMockDB.mockLogin(username);
    }
  }
};
