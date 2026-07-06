import type { ActivityLog } from "@/lib/types/activity";
import type { ProductCategory } from "@/lib/types/catalog";
import type { Customer, CustomerNote } from "@/lib/types/customer";
import type { Delivery, DeliveryUpdate } from "@/lib/types/delivery";
import type { FeedbackTicket } from "@/lib/types/feedback";
import type { FieldReport } from "@/lib/types/field-report";
import type { InventoryLog, InventoryRecord, Supplier } from "@/lib/types/inventory";
import type { Order, OrderItem, Payment } from "@/lib/types/order";
import type { SystemSetting } from "@/lib/types/settings";
import type { Statement } from "@/lib/types/statement";
import type { LoginHistoryEntry, User } from "@/lib/types/user";
import { seedCategories, seedProducts, type SeedProduct } from "./catalog";
import { seedCustomerNotes, seedCustomers } from "./customers";
import { seedInventory, seedInventoryLogs, seedSuppliers } from "./inventory";
import { seedActivityLogs, seedFeedback, seedFieldReports, seedSettings, seedStatements } from "./ops";
import { seedOrders } from "./sales";
import { seedCredentials, seedLoginHistory, seedUsers, type DemoCredential } from "./users";

export interface MockDb {
  users: User[];
  credentials: DemoCredential[];
  loginHistory: LoginHistoryEntry[];
  customers: Customer[];
  customerNotes: CustomerNote[];
  categories: ProductCategory[];
  products: SeedProduct[];
  suppliers: Supplier[];
  inventory: InventoryRecord[];
  inventoryLogs: InventoryLog[];
  orders: Order[];
  orderItems: OrderItem[];
  payments: Payment[];
  deliveries: Delivery[];
  deliveryUpdates: DeliveryUpdate[];
  statements: Statement[];
  fieldReports: FieldReport[];
  feedback: FeedbackTicket[];
  activityLogs: ActivityLog[];
  systemSettings: SystemSetting[];
}

/**
 * Expands the declarative sales seed into relational rows: order items with
 * unit prices locked from the catalog, computed order totals, payments, and
 * deliveries with their update timelines.
 */
export function buildSeedDb(): MockDb {
  const priceByProductId = new Map(seedProducts.map((p) => [p.productId, p.basePrice]));

  const orders: Order[] = [];
  const orderItems: OrderItem[] = [];
  const payments: Payment[] = [];
  const deliveries: Delivery[] = [];
  const deliveryUpdates: DeliveryUpdate[] = [];

  let itemId = 1;
  let paymentId = 1;
  let deliveryId = 1;
  let updateId = 1;

  for (const seed of seedOrders) {
    let totalAmount = 0;
    for (const item of seed.items) {
      const unitPrice = priceByProductId.get(item.productId) ?? 0;
      totalAmount += unitPrice * item.quantity;
      orderItems.push({
        itemId: itemId++,
        orderId: seed.orderId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
      });
    }

    orders.push({
      orderId: seed.orderId,
      customerId: seed.customerId,
      status: seed.status,
      totalAmount,
      createdBy: seed.createdBy,
      updatedBy: null,
      createdAt: seed.createdAt,
    });

    if (seed.payment) {
      payments.push({
        paymentId: paymentId++,
        orderId: seed.orderId,
        amount: totalAmount,
        paymentMethod: seed.payment.method,
        paymentStatus: seed.payment.status,
        processedAt: seed.payment.processedAt,
      });
    }

    if (seed.delivery) {
      const id = deliveryId++;
      deliveries.push({
        deliveryId: id,
        orderId: seed.orderId,
        courierName: seed.delivery.courierName,
        trackingNum: seed.delivery.trackingNum,
        status: seed.delivery.status,
        deliveredAt: seed.delivery.deliveredAt,
      });
      for (const update of seed.delivery.updates) {
        deliveryUpdates.push({
          updateId: updateId++,
          deliveryId: id,
          status: update.status,
          location: update.location,
          updatedAt: update.updatedAt,
        });
      }
    }
  }

  return {
    // structuredClone: keep the pristine seed modules immutable so mutations
    // only ever touch the per-process database instance.
    users: structuredClone(seedUsers),
    credentials: structuredClone(seedCredentials),
    loginHistory: structuredClone(seedLoginHistory),
    customers: structuredClone(seedCustomers),
    customerNotes: structuredClone(seedCustomerNotes),
    categories: structuredClone(seedCategories),
    products: structuredClone(seedProducts),
    suppliers: structuredClone(seedSuppliers),
    inventory: structuredClone(seedInventory),
    inventoryLogs: structuredClone(seedInventoryLogs),
    orders,
    orderItems,
    payments,
    deliveries,
    deliveryUpdates,
    statements: structuredClone(seedStatements),
    fieldReports: structuredClone(seedFieldReports),
    feedback: structuredClone(seedFeedback),
    activityLogs: structuredClone(seedActivityLogs),
    systemSettings: structuredClone(seedSettings),
  };
}
