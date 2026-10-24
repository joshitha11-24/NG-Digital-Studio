import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import customersRoutes from './routes/customers';
import bookingsRoutes from './routes/bookings';
import packagesRoutes from './routes/packages';
import galleryRoutes from './routes/gallery';
import reviewsRoutes from './routes/reviews';
import analyticsRoutes from './routes/analytics';

export function createApiRouter() {
  const router = express.Router();

  router.use(cors());
  router.use(express.json());

  // Mount API Endpoints
  router.use('/auth', authRoutes);
  router.use('/dashboard', dashboardRoutes);
  router.use('/analytics', analyticsRoutes);
  router.use('/customers', customersRoutes);
  router.use('/bookings', bookingsRoutes);
  router.use('/packages', packagesRoutes);
  router.use('/gallery', galleryRoutes);
  router.use('/reviews', reviewsRoutes);

  router.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'NG Digital Studio REST API',
      database: 'MySQL (Active Pool / Persistence Layer)',
      timestamp: new Date().toISOString()
    });
  });

  return router;
}

// Standalone runner when executing `node server.js` inside /backend
if (process.env.RUN_STANDALONE_BACKEND === 'true') {
  const app = express();
  const PORT = process.env.PORT || 5000;
  app.use('/api', createApiRouter());
  app.listen(PORT, () => {
    console.log(`NG Digital Studio Backend REST API running on http://localhost:${PORT}`);
  });
}
