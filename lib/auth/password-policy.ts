/**
 * Password strength policy: ≥8 chars, and at least one uppercase, lowercase,
 * digit, and special symbol. Enforced on every password the user chooses
 * (change-own-password and admin staff resets).
 */
export function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must include an uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must include a lowercase letter.";
  if (!/\d/.test(password)) return "Password must include a digit.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must include a special symbol.";
  return null;
}
