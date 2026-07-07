import "server-only";
import { revalidatePath } from "next/cache";
import { paginate } from "@/lib/db/list";
import { queryOne, withActor } from "@/lib/db/query";
import type { ActionResult, ListParams, Paginated } from "@/lib/types/common";
import type {
  InventoryLogWithUser,
  InventoryWithProduct,
  StockAdjustmentInput,
  Supplier,
  SupplierInput,
} from "@/lib/types/inventory";
import type { SessionUser } from "@/lib/types/user";
import { getSettingNumber } from "./settings.pg";

const INVENTORY_SELECT = `
  SELECT i.inventory_id, i.product_id, i.supplier_id, i.quantity, i.last_updated,
         p.name AS product_name, p.sku, s.company_name AS supplier_name
  FROM inventory i
  JOIN products p ON p.product_id = i.product_id
  LEFT JOIN suppliers s ON s.supplier_id = i.supplier_id`;

export async function getLowStockThreshold(): Promise<number> {
  return getSettingNumber("low_stock_threshold", 50);
}

export async function getInventory(
  params?: ListParams & { lowStockOnly?: boolean },
): Promise<Paginated<InventoryWithProduct>> {
  const where: string[] = [];
  const values: unknown[] = [];
  if (params?.lowStockOnly) {
    values.push(await getLowStockThreshold());
    where.push(`i.quantity <= $${values.length}`);
  }

  return paginate<InventoryWithProduct>(
    {
      select: INVENTORY_SELECT,
      where,
      params: values,
      searchColumns: ["p.name", "p.sku", "s.company_name"],
      sorters: { productName: "p.name", quantity: "i.quantity", lastUpdated: "i.last_updated" },
      defaultSort: "productName",
    },
    params,
  );
}

export async function getInventoryLogs(
  params?: ListParams & { inventoryId?: number },
): Promise<Paginated<InventoryLogWithUser>> {
  const select = `
    SELECT l.log_id, l.inventory_id, l.user_id, l.change_amount, l.reason, l.created_at,
           u.username, p.name AS product_name
    FROM inventory_logs l
    JOIN users u ON u.user_id = l.user_id
    JOIN inventory i ON i.inventory_id = l.inventory_id
    JOIN products p ON p.product_id = i.product_id`;

  return paginate<InventoryLogWithUser>(
    {
      select,
      where: params?.inventoryId ? ["l.inventory_id = $1"] : [],
      params: params?.inventoryId ? [params.inventoryId] : [],
      searchColumns: ["p.name", "l.reason", "u.username"],
      sorters: { createdAt: "l.created_at" },
      defaultSort: "createdAt",
      defaultDir: "desc",
    },
    params,
  );
}

export async function getSuppliers(params?: ListParams): Promise<Paginated<Supplier>> {
  return paginate<Supplier>(
    {
      select: "SELECT supplier_id, company_name, contact_email, phone FROM suppliers s",
      searchColumns: ["s.company_name", "s.contact_email", "s.phone"],
      sorters: { companyName: "s.company_name" },
      defaultSort: "companyName",
    },
    params,
  );
}

export async function adjustStock(
  data: StockAdjustmentInput,
  session: SessionUser,
): Promise<ActionResult> {
  const record = await queryOne<{ inventoryId: number; quantity: number }>(
    "SELECT inventory_id, quantity FROM inventory WHERE inventory_id = $1",
    [data.inventoryId],
  );
  if (!record) return { ok: false, error: "Inventory record not found." };

  const newQuantity = record.quantity + data.changeAmount;
  if (newQuantity < 0) {
    return {
      ok: false,
      error: "Validation failed.",
      fieldErrors: { changeAmount: [`Only ${record.quantity} units in stock - cannot go negative`] },
    };
  }

  await withActor(session.userId, async (c) => {
    await c.query("UPDATE inventory SET quantity = $1, last_updated = NOW() WHERE inventory_id = $2", [
      newQuantity,
      data.inventoryId,
    ]);
    await c.query(
      "INSERT INTO inventory_logs (inventory_id, user_id, change_amount, reason) VALUES ($1, $2, $3, $4)",
      [data.inventoryId, session.userId, data.changeAmount, data.reason],
    );
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'UPDATE', 'INVENTORY', $2)",
      [session.userId, data.inventoryId],
    );
  });

  revalidatePath("/dashboard/inventory");
  revalidatePath("/dashboard");
  return { ok: true, data: undefined };
}

export async function createSupplier(
  data: SupplierInput,
  session: SessionUser,
): Promise<ActionResult<{ id: number }>> {
  const id = await withActor(session.userId, async (c) => {
    const { rows } = await c.query(
      "INSERT INTO suppliers (company_name, contact_email, phone) VALUES ($1, $2, $3) RETURNING supplier_id",
      [data.companyName, data.contactEmail || null, data.phone || null],
    );
    const supplierId = rows[0].supplier_id as number;
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'CREATE', 'INVENTORY', $2)",
      [session.userId, supplierId],
    );
    return supplierId;
  });
  revalidatePath("/dashboard/suppliers");
  return { ok: true, data: { id } };
}

export async function updateSupplier(
  id: number,
  data: SupplierInput,
  session: SessionUser,
): Promise<ActionResult> {
  if (!(await queryOne("SELECT 1 FROM suppliers WHERE supplier_id = $1", [id]))) {
    return { ok: false, error: "Supplier not found." };
  }
  await withActor(session.userId, async (c) => {
    await c.query(
      "UPDATE suppliers SET company_name = $1, contact_email = $2, phone = $3 WHERE supplier_id = $4",
      [data.companyName, data.contactEmail || null, data.phone || null, id],
    );
    await c.query(
      "INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id) VALUES ($1, 'UPDATE', 'INVENTORY', $2)",
      [session.userId, id],
    );
  });
  revalidatePath("/dashboard/suppliers");
  return { ok: true, data: undefined };
}
