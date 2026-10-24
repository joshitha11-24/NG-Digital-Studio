import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from root .env if available
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * ==========================================================
 * NG DIGITAL STUDIO - DEDICATED ADMINISTRATOR SECURITY
 * ==========================================================
 * 
 * Configurable Administrator Credentials:
 * 1. Admin Email: admin@ngdigitalstudio.com
 * 2. Admin Password:
 *    - Configured via ADMIN_PASSWORD in your .env file
 *    - Default secure initial password: StudioAdmin@2026
 * 
 * To change or reset the administrator password:
 * - Update ADMIN_PASSWORD in the .env file, OR
 * - Update DEFAULT_ADMIN_PASSWORD in this file, OR
 * - Use the /api/auth/change-password endpoint while signed in.
 */

export const ADMIN_EMAIL = 'admin@ngdigitalstudio.com';

// Secondary studio administration alias for compatibility
export const ALLOWED_ADMIN_EMAILS = [
  'admin@ngdigitalstudio.com',
  'ng.digitalstudiomdu@gmail.com'
];

export const DEFAULT_ADMIN_PASSWORD = 'StudioAdmin@2026';

let runtimePasswordOverride: string | null = null;

export function getAdminPassword(): string {
  if (runtimePasswordOverride) {
    return runtimePasswordOverride;
  }
  return process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
}

export function setAdminPassword(newPass: string): void {
  runtimePasswordOverride = newPass.trim();
}

// ==========================================================
// Cryptographically Secure In-Memory Session Store
// ==========================================================
export interface AdminSession {
  token: string;
  email: string;
  createdAt: number;
  expiresAt: number;
}

const activeAdminSessions = new Map<string, AdminSession>();

// Sessions remain valid for 12 hours
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;

export function createAdminSession(email: string): string {
  const token = `adm_sec_${crypto.randomBytes(32).toString('hex')}`;
  const now = Date.now();
  activeAdminSessions.set(token, {
    token,
    email: email.toLowerCase().trim(),
    createdAt: now,
    expiresAt: now + SESSION_DURATION_MS
  });
  return token;
}

export function validateAdminSessionToken(token: string | undefined): AdminSession | null {
  if (!token) return null;
  const session = activeAdminSessions.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    activeAdminSessions.delete(token);
    return null;
  }

  return session;
}

export function revokeAdminSession(token: string | undefined): void {
  if (token) {
    activeAdminSessions.delete(token);
  }
}

export function verifyAdminCredentials(email: string, password: string): { valid: boolean; reason?: string } {
  if (!email || !password) {
    return { valid: false, reason: 'Email and password are required.' };
  }

  const cleanEmail = email.toLowerCase().trim();
  if (!ALLOWED_ADMIN_EMAILS.includes(cleanEmail)) {
    return {
      valid: false,
      reason: 'Access Denied: Customer accounts cannot access the Admin Panel. Only the authorized administrator account can log in.'
    };
  }

  const currentPassword = getAdminPassword();
  if (password.trim() !== currentPassword) {
    return {
      valid: false,
      reason: 'Invalid administrator password. Please verify credentials.'
    };
  }

  return { valid: true };
}

