import type { OrderStatus, PaymentMethod, PaymentStatus } from "./database";
import type { DeliveryWithUpdates } from "./delivery";

/** Mirrors `orders`, `order_items`, `payments` (ERD v1.2.0). */

export interface Order {
  orderId: number;
  customerId: number;
  status: OrderStatus;
  totalAmount: number;
  createdBy: number;
  updatedBy: number | null;
  createdAt: string;
}

export interface OrderItem {
  itemId: number;
  orderId: number;
  productId: number;
  quantity: number;
  /** Unit price locked at order creation, per DB semantics. */
  unitPrice: number;
}

export interface OrderItemWithProduct extends OrderItem {
  productName: string;
  sku: string;
}

export interface Payment {
  paymentId: number;
  orderId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  processedAt: string | null;
}

export interface OrderWithCustomer extends Order {
  customerName: string;
  itemCount: number;
}

export interface OrderDetail extends OrderWithCustomer {
  items: OrderItemWithProduct[];
  payments: Payment[];
  delivery: DeliveryWithUpdates | null;
  createdByUsername: string;
}

export interface OrderInput {
  customerId: number;
  items: { productId: number; quantity: number }[];
}

export interface PaymentInput {
  orderId: number;
  amount: number;
  paymentMethod: PaymentMethod;
}
