import "server-only";
import { generateSecret as otpGenerateSecret, generateURI, verifySync } from "otplib";
import QRCode from "qrcode";

/**
 * Google Authenticator-compatible TOTP helpers (otplib v13 functional API).
 * A 30-second epoch tolerance absorbs minor clock skew between the server and
 * the user's phone.
 */

const ISSUER = process.env.TOTP_ISSUER ?? "VayitaGrow";

export function generateSecret(): string {
  return otpGenerateSecret();
}

export function verifyTotp(token: string, secret: string): boolean {
  try {
    return verifySync({ secret, token, epochTolerance: 30 }).valid;
  } catch {
    return false;
  }
}

/** `otpauth://` URI encoded into the enrollment QR code. */
export function otpauthUrl(username: string, secret: string): string {
  return generateURI({ issuer: ISSUER, label: username, secret });
}

export function qrDataUrl(otpauth: string): Promise<string> {
  return QRCode.toDataURL(otpauth, { margin: 1, width: 220 });
}
