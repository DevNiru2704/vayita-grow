import "server-only";
import argon2 from "argon2";

/**
 * Argon2id password hashing (memory-hard, per the DB design). Used for the
 * Postgres data source; the mock demo keeps plaintext demo credentials.
 */

export function hashPassword(plaintext: string): Promise<string> {
  return argon2.hash(plaintext, { type: argon2.argon2id });
}

export async function verifyPassword(hash: string, plaintext: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plaintext);
  } catch {
    return false;
  }
}
