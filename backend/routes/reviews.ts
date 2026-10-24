import { Router, Request, Response } from 'express';
import { dbStore, ReviewRecord } from '../config/db';
import { requireAdminAuth } from '../middleware/auth';

const router = Router();

// GET approved reviews for customer website
router.get('/approved', (req: Request, res: Response) => {
  const reviews = dbStore.getApprovedReviews();
  return res.json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

// GET all reviews for Admin Panel with filter
router.get('/', requireAdminAuth, (req: Request, res: Response) => {
  const status = req.query.status as string | undefined;
  const reviews = dbStore.getAllReviews(status);
  return res.json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

// POST submit review (Customer-facing)
router.post('/', (req: Request, res: Response) => {
  try {
    const { clientName, service, reviewText, rating, location, avatar } = req.body;

    if (!clientName || !service || !reviewText) {
      return res.status(400).json({
        success: false,
        message: 'Client name, service name, and review text are required'
      });
    }

    const newReview = dbStore.addReview({
      clientName,
      service,
      reviewText,
      rating: Number(rating) || 5,
      location: location || 'Madurai',
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(clientName)}`,
      status: 'Approved' // Live review active immediately
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been published live to our customer stories feed.',
      data: newReview
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to submit review',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// PUT Approve Review (Admin)
router.put('/:id/approve', requireAdminAuth, (req: Request, res: Response) => {
  const updated = dbStore.updateReviewStatus(req.params.id, 'Approved');
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  return res.json({
    success: true,
    message: 'Review approved and published to customer website',
    data: updated
  });
});

// PUT Reject Review (Admin)
router.put('/:id/reject', requireAdminAuth, (req: Request, res: Response) => {
  const updated = dbStore.updateReviewStatus(req.params.id, 'Rejected');
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  return res.json({
    success: true,
    message: 'Review rejected',
    data: updated
  });
});

// DELETE Review (Admin)
router.delete('/:id', requireAdminAuth, (req: Request, res: Response) => {
  const deleted = dbStore.deleteReview(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  return res.json({
    success: true,
    message: 'Review deleted successfully'
  });
});

export default router;
