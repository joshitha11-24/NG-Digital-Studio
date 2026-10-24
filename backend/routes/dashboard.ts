import { Router, Request, Response } from 'express';
import { dbStore } from '../config/db';
import { requireAdminAuth } from '../middleware/auth';

const router = Router();

router.get('/stats', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const stats = dbStore.getDashboardStats();
    return res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to compute dashboard stats',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;
