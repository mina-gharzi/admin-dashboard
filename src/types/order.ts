import type { OrderItem } from "./orderItem";

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
