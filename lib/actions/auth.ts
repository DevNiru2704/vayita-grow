"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { verifyDemoCredentials } from "@/lib/auth/demo-users";
import { clearSessionCookie, getSession, setSessionCookie } from "@/lib/auth/session";
import { recordActivity } from "@/lib/mock/activity";
import { db, latency, nextId, nowIso } from "@/lib/mock/store";

export interface LoginFormState {
  error: string | null;
}

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  from: z.string().optional(),
});

/** DEMO login - swap point for Supabase Auth. */
export async function loginDemo(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  await latency();
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Enter both username and password." };
  }

  const user = verifyDemoCredentials(parsed.data.username, parsed.data.password);
  if (!user) {
    return { error: "Invalid username or password." };
  }

  await setSessionCookie(user);

  const history = db().loginHistory;
  history.push({
    historyId: nextId(history, "historyId"),
    userId: user.userId,
    loginTime: nowIso(),
    ipAddress: null,
    deviceInfo: "Demo session",
  });
  recordActivity(user.userId, "LOGIN", "SYSTEM");

  const from = parsed.data.from;
  redirect(from && from.startsWith("/dashboard") ? from : "/dashboard");
}

export async function logoutDemo(): Promise<void> {
  const session = await getSession();
  if (session) recordActivity(session.userId, "LOGOUT", "SYSTEM");
  await clearSessionCookie();
  redirect("/login");
}
