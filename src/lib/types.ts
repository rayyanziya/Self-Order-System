export type Category = "FOOD" | "DRINK";
export type OrderStatus = "WAITING_PAYMENT" | "IN_PROGRESS" | "READY";
export type OrderType = "DINE_IN" | "TAKEAWAY";

export interface MenuItemDTO {
  id: number;
  code: string;
  name: string;
  price: number;
  category: Category;
  description: string | null;
  imagePath: string | null;
  available: boolean;
}

export interface OrderItemDTO {
  id: number;
  menuItemId: number;
  menuItem: { name: string; code: string };
  quantity: number;
  unitPrice: number;
  note: string | null;
}

export interface OrderDTO {
  id: number;
  orderNumber: string;
  orderType: OrderType;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItemDTO[];
  paidAt: string | null;
  createdAt: string;
}

export type CartItem = {
  menuItem: MenuItemDTO;
  quantity: number;
  note?: string;
};
