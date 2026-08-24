/*
  آرایه‌ی کانونیِ وضعیت‌های معتبر محصول — تنها منبع حقیقت.
*/
export const PRODUCT_STATUSES = ["active", "inactive"] as const;

export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  description?: string;
}

/*
  ----------------------------------------------------------
  Update Payload
  ----------------------------------------------------------
  برای api.products.update — همون منطق UpdateUser: id از
  فیلدهای قابل‌تغییر حذف شده.
  ----------------------------------------------------------
*/
export type UpdateProduct = Partial<Omit<Product, "id">>;
