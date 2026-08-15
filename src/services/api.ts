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
  ==========================================================
*/

/*
  ----------------------------------------------------------
  Types
  ----------------------------------------------------------
*/

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "customer";
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
  Mock Data
  ----------------------------------------------------------
*/

const mockUsers: User[] = [
  {
    id: 1,
    name: "مینا احمدی",
    email: "mina@example.com",
    role: "admin",
    status: "active",
    joinedAt: "۱۴۰۴/۰۵/۱۲",
  },
  {
    id: 2,
    name: "علی رضایی",
    email: "ali@example.com",
    role: "manager",
    status: "active",
    joinedAt: "۱۴۰۴/۰۶/۲۱",
  },
  {
    id: 3,
    name: "سارا محمدی",
    email: "sara@example.com",
    role: "customer",
    status: "active",
    joinedAt: "۱۴۰۴/۰۷/۰۳",
  },
  {
    id: 4,
    name: "امیر حسینی",
    email: "amir@example.com",
    role: "customer",
    status: "inactive",
    joinedAt: "۱۴۰۴/۰۷/۱۸",
  },
  {
    id: 5,
    name: "نگار کریمی",
    email: "negar@example.com",
    role: "manager",
    status: "active",
    joinedAt: "۱۴۰۴/۰۸/۰۲",
  },
  {
    id: 6,
    name: "محمد اکبری",
    email: "mohammad@example.com",
    role: "customer",
    status: "active",
    joinedAt: "۱۴۰۴/۰۸/۱۵",
  },
  {
    id: 7,
    name: "رضا کاظمی",
    email: "reza@example.com",
    role: "customer",
    status: "active",
    joinedAt: "۱۴۰۴/۰۹/۰۱",
  },
];

const mockProducts: Product[] = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    category: "موبایل",
    price: 79900000,
    stock: 24,
    status: "active",
    description: "پرچمدار اپل با تراشه قدرتمند، دوربین حرفه‌ای و بدنه تیتانیومی.",
  },
  {
    id: 2,
    name: "MacBook Pro M3",
    category: "لپ‌تاپ",
    price: 145000000,
    stock: 8,
    status: "active",
    description: "لپ‌تاپ حرفه‌ای اپل با پردازنده M3 قدرتمند.",
  },
  {
    id: 3,
    name: "AirPods Pro 2",
    category: "هدفون",
    price: 12900000,
    stock: 42,
    status: "active",
    description: "هدفون بی‌سیم با کیفیت صدای بالا و نویز‌کنسلینگ فعال.",
  },
  {
    id: 4,
    name: "Apple Watch Series 10",
    category: "ساعت هوشمند",
    price: 32900000,
    stock: 0,
    status: "inactive",
    description: "ساعت هوشمند اپل با نمایشگر بزرگ‌تر و باتری بهتر.",
  },
  {
    id: 5,
    name: "Samsung Galaxy S25",
    category: "موبایل",
    price: 68900000,
    stock: 15,
    status: "active",
    description: "گوشی فلاگشیپ سامسونگ با دوربین 200 مگاپیکسلی.",
  },
];

const mockOrders: Order[] = [
  {
    id: "ORD-1001",
    customer: "علی رضایی",
    email: "ali@example.com",
    phone: "09121234567",
    address: "تهران، خیابان ولیعصر",
    amount: 79900000,
    status: "completed",
    date: "۱۴۰۴/۰۹/۱۲",
    items: [
      { id: 1, name: "iPhone 15 Pro Max", quantity: 1, price: 79900000 },
    ],
  },
  {
    id: "ORD-1002",
    customer: "سارا محمدی",
    email: "sara@example.com",
    phone: "09129876543",
    address: "تهران، خیابان فردوسی",
    amount: 12900000,
    status: "processing",
    date: "۱۴۰۴/۰۹/۱۳",
    items: [{ id: 3, name: "AirPods Pro 2", quantity: 1, price: 12900000 }],
  },
  {
    id: "ORD-1003",
    customer: "امیر حسینی",
    email: "amir@example.com",
    amount: 145000000,
    status: "pending",
    date: "۱۴۰۴/۰۹/۱۳",
    items: [{ id: 2, name: "MacBook Pro M3", quantity: 1, price: 145000000 }],
  },
  {
    id: "ORD-1004",
    customer: "نگار کریمی",
    email: "negar@example.com",
    amount: 32900000,
    status: "completed",
    date: "۱۴۰۴/۰۹/۱۴",
    items: [
      { id: 4, name: "Apple Watch Series 10", quantity: 1, price: 32900000 },
    ],
  },
  {
    id: "ORD-1005",
    customer: "محمد اکبری",
    email: "mohammad@example.com",
    amount: 68900000,
    status: "cancelled",
    date: "۱۴۰۴/۰۹/۱۵",
    items: [{ id: 5, name: "Samsung Galaxy S25", quantity: 1, price: 68900000 }],
  },
  {
    id: "ORD-1006",
    customer: "رضا کاظمی",
    email: "reza@example.com",
    amount: 23900000,
    status: "processing",
    date: "۱۴۰۴/۰۹/۱۵",
    items: [{ id: 3, name: "AirPods Pro 2", quantity: 2, price: 12900000 }],
  },
  {
    id: "ORD-1007",
    customer: "مریم احمدی",
    email: "maryam@example.com",
    amount: 48900000,
    status: "pending",
    date: "۱۴۰۴/۰۹/۱۶",
    items: [
      { id: 1, name: "iPhone 15 Pro Max", quantity: 0, price: 79900000 },
    ],
  },
];

/*
  ----------------------------------------------------------
  API Error Handling
  ----------------------------------------------------------
*/

export class APIError extends Error {
  public code: string;      
  public status: number;

  constructor(
    message: string,
    code: string,
    status: number
  ) {
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

export const api = {
  /*
    Users API
  */
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
          u.email.toLowerCase().includes(q)
      );
    },

    async create(user: Omit<User, "id">): Promise<User> {
      await delay();
      const newUser: User = {
        ...user,
        id: Math.max(...mockUsers.map((u) => u.id)) + 1,
      };
      mockUsers.push(newUser);
      return newUser;
    },

    async update(id: number, user: Partial<User>): Promise<User | null> {
      await delay();
      const index = mockUsers.findIndex((u) => u.id === id);
      if (index === -1) return null;
      mockUsers[index] = { ...mockUsers[index], ...user };
      return mockUsers[index];
    },

    async delete(id: number): Promise<boolean> {
      await delay();
      const index = mockUsers.findIndex((u) => u.id === id);
      if (index === -1) return false;
      mockUsers.splice(index, 1);
      return true;
    },
  },

  /*
    Products API
  */
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
      return mockProducts.filter((p) =>
        p.name.toLowerCase().includes(q)
      );
    },

    async create(product: Omit<Product, "id">): Promise<Product> {
      await delay();
      const newProduct: Product = {
        ...product,
        id: Math.max(...mockProducts.map((p) => p.id)) + 1,
      };
      mockProducts.push(newProduct);
      return newProduct;
    },

    async update(
      id: number,
      product: Partial<Product>
    ): Promise<Product | null> {
      await delay();
      const index = mockProducts.findIndex((p) => p.id === id);
      if (index === -1) return null;
      mockProducts[index] = { ...mockProducts[index], ...product };
      return mockProducts[index];
    },

    async delete(id: number): Promise<boolean> {
      await delay();
      const index = mockProducts.findIndex((p) => p.id === id);
      if (index === -1) return false;
      mockProducts.splice(index, 1);
      return true;
    },
  },

  /*
    Orders API
  */
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
          o.email.toLowerCase().includes(q)
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
      return newOrder;
    },

    async update(id: string, order: Partial<Order>): Promise<Order | null> {
      await delay();
      const index = mockOrders.findIndex((o) => o.id === id);
      if (index === -1) return null;
      mockOrders[index] = { ...mockOrders[index], ...order };
      return mockOrders[index];
    },

    async delete(id: string): Promise<boolean> {
      await delay();
      const index = mockOrders.findIndex((o) => o.id === id);
      if (index === -1) return false;
      mockOrders.splice(index, 1);
      return true;
    },
  },
};

export default api;