import { Router, Request, Response } from 'express';
import {
  verifyAdminCredentials,
  createAdminSession,
  validateAdminSessionToken,
  revokeAdminSession,
  setAdminPassword,
  getAdminPassword,
  ADMIN_EMAIL
} from '../config/adminSecurity';

const router = Router();

// ==========================================================
// 1. Separate Administrator Login Endpoint
// ==========================================================
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Administrator email and password are required.'
    });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPassword = String(password).trim();

  // Validate credentials securely against configured admin credentials
  const check = verifyAdminCredentials(cleanEmail, cleanPassword);
  if (!check.valid) {
    return res.status(401).json({
      success: false,
      message: check.reason || 'Invalid administrator email or password.'
    });
  }

  // Issue cryptographically secure administrator session token
  const sessionToken = createAdminSession(cleanEmail);

  let adminName = 'NG STUDIO LEAD ADMIN';
  if (cleanEmail === ADMIN_EMAIL) {
    adminName = 'NG STUDIO LEAD ADMIN';
  } else if (cleanEmail.includes('joshitha')) {
    adminName = 'JOSHITHA (STUDIO DIRECTOR)';
  } else {
    adminName = cleanEmail.split('@')[0].toUpperCase();
  }

  const adminProfile = {
    uid: `adm_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
    email: cleanEmail,
    name: adminName,
    role: 'STUDIO_ADMIN',
    studio: 'NG Digital Studio - Madurai'
  };

  return res.json({
    success: true,
    message: 'Administrator authenticated successfully.',
    token: sessionToken,
    admin: adminProfile
  });
});

// ==========================================================
// 2. Administrator Session Verification Endpoint
// ==========================================================
router.get('/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : (req.headers['x-admin-token'] as string);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Missing administrator authorization token.'
    });
  }

  const session = validateAdminSessionToken(token);
  if (!session) {
    return res.status(401).json({
      success: false,
      message: 'Administrator session expired or invalid. Please sign in.'
    });
  }

  let adminName = 'NG STUDIO LEAD ADMIN';
  if (session.email === ADMIN_EMAIL) {
    adminName = 'NG STUDIO LEAD ADMIN';
  } else if (session.email.includes('joshitha')) {
    adminName = 'JOSHITHA (STUDIO DIRECTOR)';
  } else {
    adminName = session.email.split('@')[0].toUpperCase();
  }

  return res.json({
    success: true,
    message: 'Administrator session active.',
    admin: {
      uid: `adm_${session.email.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email: session.email,
      name: adminName,
      role: 'STUDIO_ADMIN',
      studio: 'NG Digital Studio - Madurai'
    }
  });
});

// ==========================================================
// 3. Administrator Sign Out Endpoint
// ==========================================================
router.post('/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : (req.headers['x-admin-token'] as string);
  
  if (token) {
    revokeAdminSession(token);
  }

  return res.json({
    success: true,
    message: 'Administrator signed out successfully.'
  });
});

// ==========================================================
// 4. Administrator Profile / Me Endpoint
// ==========================================================
router.get('/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : (req.headers['x-admin-token'] as string);

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthenticated' });
  }

  const session = validateAdminSessionToken(token);
  if (!session) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session' });
  }

  return res.json({
    success: true,
    admin: {
      email: session.email,
      role: 'STUDIO_ADMIN',
      studio: 'NG Digital Studio'
    }
  });
});

// ==========================================================
// 5. Administrator Change / Reset Password Endpoint
// ==========================================================
router.post('/change-password', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : (req.headers['x-admin-token'] as string);

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const session = validateAdminSessionToken(token);
  if (!session) {
    return res.status(401).json({ success: false, message: 'Session expired' });
  }

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Current password and new password are required' });
  }

  if (currentPassword !== getAdminPassword()) {
    return res.status(403).json({ success: false, message: 'Incorrect current administrator password' });
  }

  if (newPassword.trim().length < 6) {
    return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
  }

  setAdminPassword(newPassword.trim());

  return res.json({
    success: true,
    message: 'Administrator password updated successfully.'
  });
});

export default router;
