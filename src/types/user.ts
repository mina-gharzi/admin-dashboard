export interface User {
  id: number;
  name: string;
  email: string;
  role: "system_admin" | "admin" | "sales_manager" | "salesperson" | "analyst";
  status: "active" | "inactive";
  joinedAt: string;
}
