import { Request, Response, NextFunction } from 'express';
import { validateAdminSessionToken } from '../config/adminSecurity';

export interface AuthenticatedAdminRequest extends Request {
  adminUser?: {
    email: string;
    role: string;
    uid?: string;
  };
}

export function requireAdminAuth(req: AuthenticatedAdminRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : (req.headers['x-admin-token'] as string);
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: Missing administrator authorization token.'
    });
  }

  const session = validateAdminSessionToken(token);
  if (!session) {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: Invalid or expired administrator session. Please sign in.'
    });
  }

  req.adminUser = {
    email: session.email,
    role: 'STUDIO_ADMIN',
    uid: session.token
  };

  next();
}
