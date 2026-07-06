import type { DeliveryStatus } from "./database";

/** Mirrors `deliveries`, `delivery_updates` (ERD v1.2.0). */

export interface Delivery {
  deliveryId: number;
  orderId: number;
  courierName: string | null;
  trackingNum: string | null;
  status: DeliveryStatus;
  deliveredAt: string | null;
}

export interface DeliveryUpdate {
  updateId: number;
  deliveryId: number;
  status: DeliveryStatus;
  location: string | null;
  updatedAt: string;
}

export interface DeliveryWithUpdates extends Delivery {
  updates: DeliveryUpdate[];
}

export interface DeliveryWithOrder extends Delivery {
  customerName: string;
  orderTotal: number;
}

export interface DeliveryDetail extends DeliveryWithOrder {
  updates: DeliveryUpdate[];
}

export interface DeliveryInput {
  orderId: number;
  courierName: string;
  trackingNum: string;
}

export interface DeliveryUpdateInput {
  deliveryId: number;
  status: DeliveryStatus;
  location: string;
}
