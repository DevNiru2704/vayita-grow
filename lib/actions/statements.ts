"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { isSupabase } from "@/lib/db/source";
import { recordActivity } from "@/lib/mock/activity";
import { db, latency, nextId, nowIso } from "@/lib/mock/store";
import * as statementsPg from "@/lib/services/statements.pg";
import type { ActionResult } from "@/lib/types/common";
import type { StatementInput } from "@/lib/types/statement";

// Validation + auth run here; data access dispatches to mock or Postgres
// (lib/services/statements.pg.ts) based on DATA_SOURCE. Statement PDF file
// storage arrives with the backend phase.

const statementSchema = z.object({
  customerId: z.number().int().positive("Select a client"),
  periodLabel: z.string().trim().min(3, "Period is required").max(60),
});

export async function createStatement(
  input: StatementInput,
): Promise<ActionResult<{ id: number }>> {
  const session = await requireSession();
  const parsed = statementSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  if (isSupabase) return statementsPg.createStatement(parsed.data, session);
  await latency();

  const store = db();
  if (!store.customers.some((c) => c.customerId === parsed.data.customerId)) {
    return { ok: false, error: "Client not found." };
  }

  const statementId = nextId(store.statements, "statementId");
  const year = new Date().getFullYear();
  store.statements.push({
    statementId,
    statementNumber: `STM-${year}-${String(statementId).padStart(3, "0")}`,
    customerId: parsed.data.customerId,
    periodLabel: parsed.data.periodLabel,
    uploadDate: nowIso(),
    uploadedBy: session.userId,
  });

  recordActivity(session.userId, "CREATE", "SYSTEM", statementId);
  revalidatePath("/dashboard/statements");
  revalidatePath("/dashboard");
  return { ok: true, data: { id: statementId } };
}
