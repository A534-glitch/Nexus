
import { Product, User } from "../types";
import { execute, query, initSQLite } from "./database";

const API_BASE = "http://localhost:8000/api";

/**
 * LocalMockDB: Mimics the Django Backend behavior using client-side SQLite.
 */
class LocalMockDB {
  static async getProducts(): Promise<Product[]> {
    await initSQLite();
    const rows = query("SELECT * FROM products ORDER BY created_at DESC");
    return rows.map((r: any) => ({
      id: r.id,
      sellerId: r.seller_id,
      sellerName: r.seller_name,
      title: r.title,
      description: r.description,
      price: r.price,
      category: r.category as any,
      condition: r.condition as any,
      image: r.image,
      likes: 0,
      likedBy: [],
      shares: 0,
      comments: []
    }));
  }

  static async addProduct(product: Partial<Product>): Promise<Product> {
    await initSQLite();
    const id = `sql_${Date.now()}`;
    const sellerId = product.sellerId || "999";
    const sellerName = product.sellerName || "Local User";

    execute(
      "INSERT INTO products (id, seller_id, seller_name, title, description, price, category, condition, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id, 
        sellerId, 
        sellerName, 
        product.title, 
        product.description, 
        product.price, 
        product.category, 
        product.condition, 
        product.image
      ]
    );

    return {
      ...product,
      id,
      sellerName,
      likedBy: [],
      likes: 0,
      shares: 0,
      comments: []
    } as Product;
  }

  static mockLogin(username: string): User {
    const existing = query("SELECT * FROM users WHERE username = ?", [username]);
    if (existing.length > 0) {
      const u = existing[0];
      return { id: u.id, name: u.username, college: u.college, avatar: u.avatar };
    }

    const id = `user_${Date.now()}`;
    const college = 'Nexus Local Node';
    const avatar = `https://picsum.photos/seed/${username}/200`;
    
    execute("INSERT INTO users (id, username, college, avatar) VALUES (?, ?, ?, ?)", [id, username, college, avatar]);

    return { id, name: username, avatar, college, isVerified: true };
  }
}

export const api = {
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
      console.info("Nexus: 🛰️ Django Backend Offline. Using Client SQLite.");
      return await LocalMockDB.getProducts();
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
      return await LocalMockDB.getProducts();
    }
  },

  async createProduct(product: Partial<Product>): Promise<Product | null> {
    const isUp = await this.isBackendUp();

    if (!isUp) {
      return await LocalMockDB.addProduct(product);
    }

    try {
      const response = await fetch(`${API_BASE}/products/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      return await response.json();
    } catch (e) {
      return await LocalMockDB.addProduct(product);
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
