/*
  ==========================================================
  services/api.ts
  ----------------------------------------------------------
  API Service Layer

  مزایا:
  - Centralized API calls
  - Error handling
  - Mock data ساخت‌شده درست
  - آماده برای real API integration
  - Retry logic
  - Persist در localStorage (رفرش صفحه دیگه داده رو پاک نمی‌کنه)
  ==========================================================
*/

import { loadFromStorage, saveToStorage } from "./storage";

/*
  ----------------------------------------------------------
  Types
  ----------------------------------------------------------
*/

export interface User {
  id: number;
  name: string;
  email: string;
  role: "system_admin" | "admin" | "sales_manager" | "salesperson" | "analyst";
  status: "active" | "inactive";
  joinedAt: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive";
  description?: string;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  phone?: string;
  address?: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  date: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

/*
  ----------------------------------------------------------
  Customer
  ----------------------------------------------------------
  برخلاف User (که کارکنانه)، Customer یه رکورد جدا و مستقل
  نیست — از روی سفارش‌ها (mockOrders) به‌صورت خودکار محاسبه
  میشه: هر ایمیل یکتا داخل سفارش‌ها = یک مشتری. یعنی این
  پنل هیچ فرم «افزودن مشتری» نداره؛ مشتری با اولین سفارشش
  به این لیست اضافه میشه — دقیقاً مثل یه فروشگاه واقعی.
  ----------------------------------------------------------
*/

export interface Customer {
  email: string;
  name: string;
  phone?: string;
  address?: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  /** «فعال» یعنی حداقل یک سفارش لغونشده داره */
  status: "active" | "inactive";
}

/*
  ----------------------------------------------------------
  Seed Data
  ----------------------------------------------------------
*/

/*
  کاربران این پنل، کارکنان فروشگاه هستن (نه مشتری‌های
  فروشگاه) — برای همین پنج نقش اول این لیست دقیقاً همون
  ایمیل/نام/نقشِ حساب‌های نمونه‌ی صفحه‌ی ورود هستن
  (src/data/demoAccounts.ts)، تا وقتی کسی با یکی از اون
  ایمیل‌ها وارد میشه، خودش رو تو همین لیست کاربران هم ببینه.
*/
const seedUsers: User[] = [
  { id: 1, name: "مینا احمدی", email: "admin@shopino.ir", role: "system_admin", status: "active", joinedAt: "۱۴۰۴/۰۵/۱۲" },
  { id: 2, name: "علی رضایی", email: "ali.rezaei@shopino.ir", role: "admin", status: "active", joinedAt: "۱۴۰۴/۰۶/۲۱" },
  { id: 3, name: "نگار کریمی", email: "negar.karimi@shopino.ir", role: "sales_manager", status: "active", joinedAt: "۱۴۰۴/۰۷/۰۳" },
  { id: 4, name: "رضا کاظمی", email: "reza.kazemi@shopino.ir", role: "salesperson", status: "active", joinedAt: "۱۴۰۴/۰۷/۱۸" },
  { id: 5, name: "سارا محمدی", email: "sara.mohammadi@shopino.ir", role: "analyst", status: "active", joinedAt: "۱۴۰۴/۰۸/۰۲" },
  { id: 6, name: "امیر حسینی", email: "amir.hosseini@shopino.ir", role: "salesperson", status: "inactive", joinedAt: "۱۴۰۴/۰۸/۱۵" },
  { id: 7, name: "محمد اکبری", email: "mohammad.akbari@shopino.ir", role: "sales_manager", status: "active", joinedAt: "۱۴۰۴/۰۹/۰۱" },
];

const seedProducts: Product[] = [
  { id: 1, name: "iPhone 15 Pro Max", category: "موبایل", price: 79900000, stock: 24, status: "active", description: "پرچمدار اپل با تراشه قدرتمند، دوربین حرفه‌ای و بدنه تیتانیومی." },
  { id: 2, name: "MacBook Pro M3", category: "لپ‌تاپ", price: 145000000, stock: 8, status: "active", description: "لپ‌تاپ حرفه‌ای اپل با پردازنده M3 قدرتمند." },
  { id: 3, name: "AirPods Pro 2", category: "هدفون", price: 12900000, stock: 42, status: "active", description: "هدفون بی‌سیم با کیفیت صدای بالا و نویز‌کنسلینگ فعال." },
  { id: 4, name: "Apple Watch Series 10", category: "ساعت هوشمند", price: 32900000, stock: 0, status: "inactive", description: "ساعت هوشمند اپل با نمایشگر بزرگ‌تر و باتری بهتر." },
  { id: 5, name: "Samsung Galaxy S25", category: "موبایل", price: 68900000, stock: 15, status: "active", description: "گوشی فلاگشیپ سامسونگ با دوربین ۲۰۰ مگاپیکسلی." },
];

const seedOrders: Order[] = [
  { id: "ORD-1001", customer: "علی رضایی", email: "ali@example.com", phone: "09121234567", address: "تهران، خیابان ولیعصر", amount: 79900000, status: "completed", date: "۱۴۰۴/۰۹/۱۲", items: [{ id: 1, name: "iPhone 15 Pro Max", quantity: 1, price: 79900000 }] },
  { id: "ORD-1002", customer: "سارا محمدی", email: "sara@example.com", phone: "09129876543", address: "تهران، خیابان فردوسی", amount: 12900000, status: "processing", date: "۱۴۰۴/۰۹/۱۳", items: [{ id: 3, name: "AirPods Pro 2", quantity: 1, price: 12900000 }] },
  { id: "ORD-1003", customer: "امیر حسینی", email: "amir@example.com", amount: 145000000, status: "pending", date: "۱۴۰۴/۰۹/۱۳", items: [{ id: 2, name: "MacBook Pro M3", quantity: 1, price: 145000000 }] },
  { id: "ORD-1004", customer: "نگار کریمی", email: "negar@example.com", amount: 32900000, status: "completed", date: "۱۴۰۴/۰۹/۱۴", items: [{ id: 4, name: "Apple Watch Series 10", quantity: 1, price: 32900000 }] },
  { id: "ORD-1005", customer: "محمد اکبری", email: "mohammad@example.com", amount: 68900000, status: "cancelled", date: "۱۴۰۴/۰۹/۱۵", items: [{ id: 5, name: "Samsung Galaxy S25", quantity: 1, price: 68900000 }] },
  { id: "ORD-1006", customer: "رضا کاظمی", email: "reza@example.com", amount: 23900000, status: "processing", date: "۱۴۰۴/۰۹/۱۵", items: [{ id: 3, name: "AirPods Pro 2", quantity: 2, price: 12900000 }] },
  { id: "ORD-1007", customer: "مریم احمدی", email: "maryam@example.com", amount: 79900000, status: "pending", date: "۱۴۰۴/۰۹/۱۶", items: [{ id: 1, name: "iPhone 15 Pro Max", quantity: 1, price: 79900000 }] },
];

/*
  ----------------------------------------------------------
  Sanitizers (برای جلوگیری از کرش و داده‌های خراب)
  ----------------------------------------------------------
*/

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

const VALID_USER_ROLES = [
  "system_admin",
  "admin",
  "sales_manager",
  "salesperson",
  "analyst",
] as const;
const VALID_USER_STATUSES = ["active", "inactive"] as const;
const VALID_PRODUCT_STATUSES = ["active", "inactive"] as const;

const VALID_ORDER_STATUSES = [
  "pending",
  "processing",
  "completed",
  "cancelled",
] as const;

function sanitizeUsers(raw: unknown, fallback: User[]): User[] {
  if (!Array.isArray(raw)) return fallback;
  return raw.filter((u): u is User => {
    if (!isRecord(u)) return false;
    return (
      typeof u.id === "number" &&
      typeof u.name === "string" &&
      typeof u.email === "string" &&
      (VALID_USER_ROLES as readonly unknown[]).includes(u.role) &&
      (VALID_USER_STATUSES as readonly unknown[]).includes(u.status) &&
      typeof u.joinedAt === "string"
    );
  });
}

function sanitizeProducts(raw: unknown, fallback: Product[]): Product[] {
  if (!Array.isArray(raw)) return fallback;
  return raw.filter((p): p is Product => {
    if (!isRecord(p)) return false;
    return (
      typeof p.id === "number" &&
      typeof p.name === "string" &&
      typeof p.category === "string" &&
      typeof p.price === "number" &&
      typeof p.stock === "number" &&
      (VALID_PRODUCT_STATUSES as readonly unknown[]).includes(p.status) &&
      (p.description === undefined || typeof p.description === "string")
    );
  });
}

function isOrderItem(value: unknown): value is OrderItem {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.name === "string" &&
    typeof value.quantity === "number" &&
    typeof value.price === "number"
  );
}

function sanitizeOrders(raw: unknown, fallback: Order[]): Order[] {
  if (!Array.isArray(raw)) return fallback;
  return raw.filter((o): o is Order => {
    if (!isRecord(o)) return false;
    return (
      typeof o.id === "string" &&
      typeof o.customer === "string" &&
      typeof o.email === "string" &&
      (o.phone === undefined || typeof o.phone === "string") &&
      (o.address === undefined || typeof o.address === "string") &&
      typeof o.amount === "number" &&
      (VALID_ORDER_STATUSES as readonly unknown[]).includes(o.status) &&
      typeof o.date === "string" &&
      (o.items === undefined ||
        (Array.isArray(o.items) && o.items.every(isOrderItem)))
    );
  });
}

/*
  ----------------------------------------------------------
  Live Data (بار اول از localStorage، در غیر این صورت seed)
  ----------------------------------------------------------
*/

const mockUsers: User[] = sanitizeUsers(
  loadFromStorage("users", seedUsers),
  seedUsers,
);

const mockProducts: Product[] = sanitizeProducts(
  loadFromStorage("products", seedProducts),
  seedProducts,
);

const mockOrders: Order[] = sanitizeOrders(
  loadFromStorage("orders", seedOrders),
  seedOrders,
);

function persistUsers() {
  saveToStorage("users", mockUsers);
}
function persistProducts() {
  saveToStorage("products", mockProducts);
}
function persistOrders() {
  saveToStorage("orders", mockOrders);
}

/*
  ----------------------------------------------------------
  API Error Handling
  ----------------------------------------------------------
*/

export class APIError extends Error {
  public code: string;
  public status: number;
  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "APIError";
    this.code = code;
    this.status = status;
  }
}

/*
  ----------------------------------------------------------
  Simulate API Delay
  ----------------------------------------------------------
*/

function delay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/*
  ----------------------------------------------------------
  API Service (Mock Implementation)
  ----------------------------------------------------------
*/

/*
  ----------------------------------------------------------
  محاسبه‌ی لیست مشتری‌ها از روی سفارش‌ها
  ----------------------------------------------------------
  هر ایمیل یکتای داخل سفارش‌ها = یک مشتری. اطلاعاتش (تعداد
  سفارش، مجموع خرید، آخرین سفارش) با یه پیمایش روی سفارش‌ها
  محاسبه میشه.
  ----------------------------------------------------------
*/

function buildCustomersFromOrders(orders: Order[]): Customer[] {
  const customersByEmail = new Map<string, Customer>();

  for (const order of orders) {
    const key = order.email.trim().toLowerCase();
    const isCancelled = order.status === "cancelled";
    const existing = customersByEmail.get(key);

    if (existing) {
      existing.ordersCount += 1;
      if (!isCancelled) {
        existing.totalSpent += order.amount;
        existing.status = "active";
      }
      // آخرین سفارش برنده‌ست (سفارش‌ها به ترتیب زمانی درج میشن)
      existing.lastOrderDate = order.date;
      if (order.phone) existing.phone = order.phone;
      if (order.address) existing.address = order.address;
    } else {
      customersByEmail.set(key, {
        email: order.email,
        name: order.customer,
        phone: order.phone,
        address: order.address,
        ordersCount: 1,
        totalSpent: isCancelled ? 0 : order.amount,
        lastOrderDate: order.date,
        status: isCancelled ? "inactive" : "active",
      });
    }
  }

  return Array.from(customersByEmail.values());
}

export const api = {
  users: {
    async getAll(): Promise<User[]> {
      await delay();
      return mockUsers;
    },

    async getById(id: number): Promise<User | null> {
      await delay();
      return mockUsers.find((u) => u.id === id) || null;
    },

    async search(query: string): Promise<User[]> {
      await delay();
      const q = query.toLowerCase();
      return mockUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          String(u.id).includes(q),
      );
    },

    async create(user: Omit<User, "id">): Promise<User> {
      await delay();
      const newUser: User = {
        ...user,
        id:
          mockUsers.length > 0
            ? Math.max(...mockUsers.map((u) => u.id)) + 1
            : 1,
      };
      mockUsers.push(newUser);
      persistUsers();
      return newUser;
    },

    async update(id: number, user: Partial<User>): Promise<User | null> {
      await delay();
      const index = mockUsers.findIndex((u) => u.id === id);
      if (index === -1) return null;
      mockUsers[index] = { ...mockUsers[index], ...user };
      persistUsers();
      return mockUsers[index];
    },

    async delete(id: number): Promise<boolean> {
      await delay();
      const index = mockUsers.findIndex((u) => u.id === id);
      if (index === -1) return false;
      mockUsers.splice(index, 1);
      persistUsers();
      return true;
    },
  },

  products: {
    async getAll(): Promise<Product[]> {
      await delay();
      return mockProducts;
    },

    async getById(id: number): Promise<Product | null> {
      await delay();
      return mockProducts.find((p) => p.id === id) || null;
    },

    async search(query: string): Promise<Product[]> {
      await delay();
      const q = query.toLowerCase();
      return mockProducts.filter((p) => p.name.toLowerCase().includes(q));
    },

    async create(product: Omit<Product, "id">): Promise<Product> {
      await delay();
      const newProduct: Product = {
        ...product,
        id:
          mockProducts.length > 0
            ? Math.max(...mockProducts.map((p) => p.id)) + 1
            : 1,
      };
      mockProducts.push(newProduct);
      persistProducts();
      return newProduct;
    },

    async update(
      id: number,
      product: Partial<Product>,
    ): Promise<Product | null> {
      await delay();
      const index = mockProducts.findIndex((p) => p.id === id);
      if (index === -1) return null;
      mockProducts[index] = { ...mockProducts[index], ...product };
      persistProducts();
      return mockProducts[index];
    },

    async delete(id: number): Promise<boolean> {
      await delay();
      const index = mockProducts.findIndex((p) => p.id === id);
      if (index === -1) return false;
      mockProducts.splice(index, 1);
      persistProducts();
      return true;
    },
  },

  orders: {
    async getAll(): Promise<Order[]> {
      await delay();
      return mockOrders;
    },

    async getById(id: string): Promise<Order | null> {
      await delay();
      return mockOrders.find((o) => o.id === id) || null;
    },

    async search(query: string): Promise<Order[]> {
      await delay();
      const q = query.toLowerCase();
      return mockOrders.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.email.toLowerCase().includes(q),
      );
    },

    async create(order: Omit<Order, "id" | "date">): Promise<Order> {
      await delay();
      const newOrder: Order = {
        ...order,
        id: `ORD-${Date.now()}`,
        date: new Date().toLocaleDateString("fa-IR"),
      };
      mockOrders.push(newOrder);
      persistOrders();
      return newOrder;
    },

    async update(id: string, order: Partial<Order>): Promise<Order | null> {
      await delay();
      const index = mockOrders.findIndex((o) => o.id === id);
      if (index === -1) return null;
      mockOrders[index] = { ...mockOrders[index], ...order };
      persistOrders();
      return mockOrders[index];
    },

    async delete(id: string): Promise<boolean> {
      await delay();
      const index = mockOrders.findIndex((o) => o.id === id);
      if (index === -1) return false;
      mockOrders.splice(index, 1);
      persistOrders();
      return true;
    },
  },

  customers: {
    async getAll(): Promise<Customer[]> {
      await delay();
      return buildCustomersFromOrders(mockOrders);
    },

    async search(query: string): Promise<Customer[]> {
      await delay();
      const q = query.trim().toLowerCase();
      const all = buildCustomersFromOrders(mockOrders);
      if (!q) return all;
      return all.filter(
        (c) =>
          c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
      );
    },

    /** دریافت جزئیات یک مشتری، بر اساس ایمیل */
    async getByEmail(email: string): Promise<Customer | null> {
      await delay();
      const key = email.trim().toLowerCase();
      return (
        buildCustomersFromOrders(mockOrders).find(
          (customer) => customer.email.trim().toLowerCase() === key,
        ) ?? null
      );
    },

    /** لیست سفارش‌های یک مشتری خاص، بر اساس ایمیل */
    async getOrdersByEmail(email: string): Promise<Order[]> {
      await delay();
      const key = email.trim().toLowerCase();
      return mockOrders
        .filter((o) => o.email.trim().toLowerCase() === key)
        .slice()
        .reverse(); // جدیدترین سفارش اول
    },
  },

  analytics: {
    async getSummary(): Promise<{
      totalUsers: number;
      totalProducts: number;
      activeProducts: number;
      totalOrders: number;
      totalRevenue: number;
      averageOrderValue: number;
      ordersByStatus: Record<Order["status"], number>;
      usersByRole: Record<User["role"], number>;
      usersByStatus: Record<User["status"], number>;
      totalCustomers: number;
      activeCustomers: number;
      productsByCategory: { category: string; count: number }[];
      lowStockProducts: Product[];
      topProducts: { name: string; quantity: number; revenue: number }[];
      recentOrders: Order[];
    }> {
      await delay();

      const completedOrders = mockOrders.filter(
        (o) => o.status === "completed",
      );

      const totalRevenue = completedOrders.reduce(
        (sum, o) => sum + o.amount,
        0,
      );

      const averageOrderValue =
        completedOrders.length > 0
          ? Math.round(totalRevenue / completedOrders.length)
          : 0;

      const ordersByStatus: Record<Order["status"], number> = {
        pending: 0,
        processing: 0,
        completed: 0,
        cancelled: 0,
      };

      for (const order of mockOrders) {
        ordersByStatus[order.status] = (ordersByStatus[order.status] ?? 0) + 1;
      }

      const usersByRole: Record<User["role"], number> = {
        system_admin: 0,
        admin: 0,
        sales_manager: 0,
        salesperson: 0,
        analyst: 0,
      };

      const usersByStatus: Record<User["status"], number> = {
        active: 0,
        inactive: 0,
      };

      for (const user of mockUsers) {
        usersByRole[user.role] = (usersByRole[user.role] ?? 0) + 1;
        usersByStatus[user.status] = (usersByStatus[user.status] ?? 0) + 1;
      }

      const categoryMap = new Map<string, number>();
      for (const product of mockProducts) {
        categoryMap.set(
          product.category,
          (categoryMap.get(product.category) ?? 0) + 1,
        );
      }

      const productsByCategory = Array.from(categoryMap.entries()).map(
        ([category, count]) => ({ category, count }),
      );

      const lowStockProducts = mockProducts.filter(
        (p) => p.status === "active" && p.stock <= 5,
      );

      const productSales = new Map<
        string,
        { quantity: number; revenue: number }
      >();

      for (const order of completedOrders) {
        for (const item of order.items ?? []) {
          const existing = productSales.get(item.name) ?? {
            quantity: 0,
            revenue: 0,
          };

          existing.quantity += item.quantity;
          existing.revenue += item.price * item.quantity;

          productSales.set(item.name, existing);
        }
      }

      const topProducts = Array.from(productSales.entries())
        .map(([name, stats]) => ({ name, ...stats }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      const recentOrders = mockOrders.slice(-5).reverse();

      const customers = buildCustomersFromOrders(mockOrders);
      const totalCustomers = customers.length;
      const activeCustomers = customers.filter(
        (c) => c.status === "active",
      ).length;

      return {
        totalUsers: mockUsers.length,
        totalProducts: mockProducts.length,
        activeProducts: mockProducts.filter((p) => p.status === "active")
          .length,
        totalOrders: mockOrders.length,
        totalRevenue,
        averageOrderValue,
        ordersByStatus,
        usersByRole,
        usersByStatus,
        totalCustomers,
        activeCustomers,
        productsByCategory,
        lowStockProducts,
        topProducts,
        recentOrders,
      };
    },
  },

  system: {
    async resetToSampleData(): Promise<void> {
      await delay(200);
      mockUsers.splice(0, mockUsers.length, ...seedUsers);
      mockProducts.splice(0, mockProducts.length, ...seedProducts);
      mockOrders.splice(0, mockOrders.length, ...seedOrders);
      persistUsers();
      persistProducts();
      persistOrders();
    },

    async clearAllData(): Promise<void> {
      await delay(200);
      mockUsers.splice(0, mockUsers.length);
      mockProducts.splice(0, mockProducts.length);
      mockOrders.splice(0, mockOrders.length);
      persistUsers();
      persistProducts();
      persistOrders();
    },
  },
};

export default api;
