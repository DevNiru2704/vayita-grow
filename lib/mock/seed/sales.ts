import type { OrderStatus, PaymentMethod, PaymentStatus, DeliveryStatus } from "@/lib/types/database";

/**
 * DEMO operational data - orders, payments, and deliveries for the portal.
 * Order items reference the REAL product catalog only (productId 1-10).
 * Totals are computed at seed time from quantity × unit price.
 */

export interface SeedOrder {
  orderId: number;
  customerId: number;
  status: OrderStatus;
  createdBy: number;
  createdAt: string;
  items: { productId: number; quantity: number }[];
  payment?: { method: PaymentMethod; status: PaymentStatus; processedAt: string | null };
  delivery?: {
    courierName: string;
    trackingNum: string;
    status: DeliveryStatus;
    deliveredAt: string | null;
    updates: { status: DeliveryStatus; location: string; updatedAt: string }[];
  };
}

export const seedOrders: SeedOrder[] = [
  {
    orderId: 1, customerId: 1, status: "Delivered", createdBy: 2, createdAt: "2026-01-12T05:30:00.000Z",
    items: [{ productId: 1, quantity: 120 }, { productId: 3, quantity: 80 }],
    payment: { method: "Bank_Transfer", status: "Completed", processedAt: "2026-01-14T09:00:00.000Z" },
    delivery: {
      courierName: "Eastern Roadways", trackingNum: "ER-260112-114", status: "Delivered", deliveredAt: "2026-01-18T10:00:00.000Z",
      updates: [
        { status: "Dispatching", location: "Warehouse, Ranchi", updatedAt: "2026-01-14T06:00:00.000Z" },
        { status: "In_Transit", location: "Asansol Hub", updatedAt: "2026-01-16T07:30:00.000Z" },
        { status: "Delivered", location: "Kolkata", updatedAt: "2026-01-18T10:00:00.000Z" },
      ],
    },
  },
  {
    orderId: 2, customerId: 8, status: "Delivered", createdBy: 2, createdAt: "2026-01-25T06:10:00.000Z",
    items: [{ productId: 5, quantity: 60 }, { productId: 6, quantity: 100 }],
    payment: { method: "UPI", status: "Completed", processedAt: "2026-01-26T08:00:00.000Z" },
    delivery: {
      courierName: "Jharkhand Cargo", trackingNum: "JC-260125-207", status: "Delivered", deliveredAt: "2026-01-28T09:30:00.000Z",
      updates: [
        { status: "Dispatching", location: "Warehouse, Ranchi", updatedAt: "2026-01-26T05:00:00.000Z" },
        { status: "Delivered", location: "Ranchi", updatedAt: "2026-01-28T09:30:00.000Z" },
      ],
    },
  },
  {
    orderId: 3, customerId: 2, status: "Delivered", createdBy: 3, createdAt: "2026-02-06T04:45:00.000Z",
    items: [{ productId: 2, quantity: 90 }, { productId: 10, quantity: 50 }],
    payment: { method: "Bank_Transfer", status: "Completed", processedAt: "2026-02-08T10:00:00.000Z" },
    delivery: {
      courierName: "Eastern Roadways", trackingNum: "ER-260206-142", status: "Delivered", deliveredAt: "2026-02-11T11:00:00.000Z",
      updates: [
        { status: "Dispatching", location: "Warehouse, Ranchi", updatedAt: "2026-02-08T06:00:00.000Z" },
        { status: "In_Transit", location: "Durgapur Hub", updatedAt: "2026-02-09T09:00:00.000Z" },
        { status: "Delivered", location: "Hooghly", updatedAt: "2026-02-11T11:00:00.000Z" },
      ],
    },
  },
  {
    orderId: 4, customerId: 9, status: "Delivered", createdBy: 2, createdAt: "2026-02-18T07:20:00.000Z",
    items: [{ productId: 7, quantity: 150 }],
    payment: { method: "Cash", status: "Completed", processedAt: "2026-02-20T08:30:00.000Z" },
    delivery: {
      courierName: "Jharkhand Cargo", trackingNum: "JC-260218-231", status: "Delivered", deliveredAt: "2026-02-21T10:15:00.000Z",
      updates: [
        { status: "Dispatching", location: "Warehouse, Ranchi", updatedAt: "2026-02-19T05:30:00.000Z" },
        { status: "Delivered", location: "Jamshedpur", updatedAt: "2026-02-21T10:15:00.000Z" },
      ],
    },
  },
  {
    orderId: 5, customerId: 4, status: "Delivered", createdBy: 3, createdAt: "2026-03-03T05:00:00.000Z",
    items: [{ productId: 1, quantity: 70 }, { productId: 4, quantity: 200 }, { productId: 8, quantity: 60 }],
    payment: { method: "Bank_Transfer", status: "Completed", processedAt: "2026-03-05T09:00:00.000Z" },
    delivery: {
      courierName: "Eastern Roadways", trackingNum: "ER-260303-168", status: "Delivered", deliveredAt: "2026-03-08T12:00:00.000Z",
      updates: [
        { status: "Dispatching", location: "Warehouse, Ranchi", updatedAt: "2026-03-05T06:00:00.000Z" },
        { status: "In_Transit", location: "Asansol Hub", updatedAt: "2026-03-06T08:00:00.000Z" },
        { status: "Delivered", location: "Bardhaman", updatedAt: "2026-03-08T12:00:00.000Z" },
      ],
    },
  },
  {
    orderId: 6, customerId: 5, status: "Delivered", createdBy: 2, createdAt: "2026-03-15T06:30:00.000Z",
    items: [{ productId: 9, quantity: 40 }, { productId: 3, quantity: 55 }],
    payment: { method: "UPI", status: "Completed", processedAt: "2026-03-16T07:45:00.000Z" },
    delivery: {
      courierName: "North Bengal Logistics", trackingNum: "NBL-260315-089", status: "Delivered", deliveredAt: "2026-03-20T09:00:00.000Z",
      updates: [
        { status: "Dispatching", location: "Warehouse, Ranchi", updatedAt: "2026-03-16T05:00:00.000Z" },
        { status: "In_Transit", location: "Malda Hub", updatedAt: "2026-03-18T10:00:00.000Z" },
        { status: "Delivered", location: "Siliguri", updatedAt: "2026-03-20T09:00:00.000Z" },
      ],
    },
  },
  {
    orderId: 7, customerId: 11, status: "Delivered", createdBy: 4, createdAt: "2026-04-02T04:50:00.000Z",
    items: [{ productId: 6, quantity: 80 }, { productId: 5, quantity: 40 }],
    payment: { method: "Bank_Transfer", status: "Completed", processedAt: "2026-04-04T08:00:00.000Z" },
    delivery: {
      courierName: "Jharkhand Cargo", trackingNum: "JC-260402-312", status: "Delivered", deliveredAt: "2026-04-06T11:30:00.000Z",
      updates: [
        { status: "Dispatching", location: "Warehouse, Ranchi", updatedAt: "2026-04-03T06:00:00.000Z" },
        { status: "Delivered", location: "Hazaribagh", updatedAt: "2026-04-06T11:30:00.000Z" },
      ],
    },
  },
  {
    orderId: 8, customerId: 7, status: "Delivered", createdBy: 3, createdAt: "2026-04-14T05:40:00.000Z",
    items: [{ productId: 2, quantity: 110 }],
    payment: { method: "Bank_Transfer", status: "Completed", processedAt: "2026-04-16T09:15:00.000Z" },
    delivery: {
      courierName: "Eastern Roadways", trackingNum: "ER-260414-190", status: "Delivered", deliveredAt: "2026-04-19T10:45:00.000Z",
      updates: [
        { status: "Dispatching", location: "Warehouse, Ranchi", updatedAt: "2026-04-16T05:30:00.000Z" },
        { status: "In_Transit", location: "Durgapur Hub", updatedAt: "2026-04-17T09:00:00.000Z" },
        { status: "Delivered", location: "Krishnanagar", updatedAt: "2026-04-19T10:45:00.000Z" },
      ],
    },
  },
  {
    orderId: 9, customerId: 1, status: "Delivered", createdBy: 2, createdAt: "2026-05-05T06:00:00.000Z",
    items: [{ productId: 10, quantity: 75 }, { productId: 1, quantity: 60 }],
    payment: { method: "UPI", status: "Completed", processedAt: "2026-05-06T07:30:00.000Z" },
    delivery: {
      courierName: "Eastern Roadways", trackingNum: "ER-260505-215", status: "Delivered", deliveredAt: "2026-05-09T09:20:00.000Z",
      updates: [
        { status: "Dispatching", location: "Warehouse, Ranchi", updatedAt: "2026-05-06T06:00:00.000Z" },
        { status: "In_Transit", location: "Asansol Hub", updatedAt: "2026-05-07T08:30:00.000Z" },
        { status: "Delivered", location: "Kolkata", updatedAt: "2026-05-09T09:20:00.000Z" },
      ],
    },
  },
  {
    orderId: 10, customerId: 6, status: "Delivered", createdBy: 3, createdAt: "2026-05-18T05:10:00.000Z",
    items: [{ productId: 4, quantity: 150 }, { productId: 10, quantity: 45 }],
    payment: { method: "Cash", status: "Completed", processedAt: "2026-05-20T10:00:00.000Z" },
    delivery: {
      courierName: "North Bengal Logistics", trackingNum: "NBL-260518-102", status: "Delivered", deliveredAt: "2026-05-23T11:00:00.000Z",
      updates: [
        { status: "Dispatching", location: "Warehouse, Ranchi", updatedAt: "2026-05-19T05:00:00.000Z" },
        { status: "In_Transit", location: "Malda Hub", updatedAt: "2026-05-21T09:30:00.000Z" },
        { status: "Delivered", location: "Malda", updatedAt: "2026-05-23T11:00:00.000Z" },
      ],
    },
  },
  {
    orderId: 11, customerId: 8, status: "Shipped", createdBy: 2, createdAt: "2026-06-10T06:20:00.000Z",
    items: [{ productId: 5, quantity: 90 }, { productId: 7, quantity: 60 }],
    payment: { method: "Bank_Transfer", status: "Completed", processedAt: "2026-06-12T08:00:00.000Z" },
    delivery: {
      courierName: "Jharkhand Cargo", trackingNum: "JC-260610-401", status: "In_Transit", deliveredAt: null,
      updates: [
        { status: "Dispatching", location: "Warehouse, Ranchi", updatedAt: "2026-06-12T05:00:00.000Z" },
        { status: "In_Transit", location: "Ramgarh Hub", updatedAt: "2026-06-13T07:45:00.000Z" },
      ],
    },
  },
  {
    orderId: 12, customerId: 3, status: "Shipped", createdBy: 3, createdAt: "2026-06-18T04:55:00.000Z",
    items: [{ productId: 3, quantity: 100 }, { productId: 2, quantity: 40 }],
    payment: { method: "Bank_Transfer", status: "Pending", processedAt: null },
    delivery: {
      courierName: "Eastern Roadways", trackingNum: "ER-260618-277", status: "In_Transit", deliveredAt: null,
      updates: [
        { status: "Dispatching", location: "Warehouse, Ranchi", updatedAt: "2026-06-20T06:00:00.000Z" },
        { status: "In_Transit", location: "Asansol Hub", updatedAt: "2026-06-22T08:15:00.000Z" },
      ],
    },
  },
  {
    orderId: 13, customerId: 12, status: "Processing", createdBy: 2, createdAt: "2026-06-24T07:00:00.000Z",
    items: [{ productId: 1, quantity: 50 }, { productId: 6, quantity: 40 }],
    payment: { method: "UPI", status: "Completed", processedAt: "2026-06-25T09:30:00.000Z" },
  },
  {
    orderId: 14, customerId: 9, status: "Processing", createdBy: 4, createdAt: "2026-06-28T05:35:00.000Z",
    items: [{ productId: 8, quantity: 85 }],
    payment: { method: "Bank_Transfer", status: "Pending", processedAt: null },
  },
  {
    orderId: 15, customerId: 4, status: "Pending", createdBy: 3, createdAt: "2026-07-01T06:45:00.000Z",
    items: [{ productId: 9, quantity: 30 }, { productId: 5, quantity: 55 }],
  },
  {
    orderId: 16, customerId: 11, status: "Pending", createdBy: 2, createdAt: "2026-07-02T08:10:00.000Z",
    items: [{ productId: 10, quantity: 65 }],
  },
  {
    orderId: 17, customerId: 2, status: "Pending", createdBy: 2, createdAt: "2026-07-03T05:25:00.000Z",
    items: [{ productId: 4, quantity: 120 }, { productId: 1, quantity: 45 }],
  },
  {
    orderId: 18, customerId: 10, status: "Cancelled", createdBy: 2, createdAt: "2026-03-25T06:50:00.000Z",
    items: [{ productId: 7, quantity: 40 }],
  },
];
