import { Router, Request, Response } from 'express';
import { dbStore, GalleryRecord } from '../config/db';
import { requireAdminAuth } from '../middleware/auth';

const router = Router();

// GET all gallery photos (public or filtered by category)
router.get('/', (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;
  const items = dbStore.getAllGallery(category);
  return res.json({
    success: true,
    count: items.length,
    data: items
  });
});

// POST add photo to gallery (Admin)
router.post('/', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { title, category, imageUrl, thumbnailUrl, description, location } = req.body;

    if (!title || !category || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, and imageUrl are required'
      });
    }

    const newItem = dbStore.addGalleryItem({
      title,
      category: category as GalleryRecord['category'],
      imageUrl,
      thumbnailUrl: thumbnailUrl || imageUrl,
      description: description || '',
      location: location || 'Madurai'
    });

    return res.status(201).json({
      success: true,
      message: 'Image added to studio gallery successfully',
      data: newItem
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to add gallery item',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// DELETE photo from gallery (Admin)
router.delete('/:id', requireAdminAuth, (req: Request, res: Response) => {
  const deleted = dbStore.deleteGalleryItem(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Gallery item not found' });
  }

  return res.json({
    success: true,
    message: 'Gallery item deleted successfully'
  });
});

export default router;
