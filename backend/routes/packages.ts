import { Router, Request, Response } from 'express';
import { dbStore } from '../config/db';
import { requireAdminAuth } from '../middleware/auth';

const router = Router();

// GET all packages
router.get('/', (req: Request, res: Response) => {
  const packages = dbStore.getAllPackages();
  return res.json({
    success: true,
    data: packages
  });
});

// GET package by id
router.get('/:id', (req: Request, res: Response) => {
  const pkg = dbStore.getPackageById(req.params.id);
  if (!pkg) {
    return res.status(404).json({ success: false, message: 'Package not found' });
  }
  return res.json({ success: true, data: pkg });
});

// POST create new package (Admin)
router.post('/', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const {
      name,
      tier,
      price,
      album,
      drone,
      video,
      photoCount,
      deliveryTime,
      description,
      features,
      isActive
    } = req.body;

    if (!name || !tier || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name, tier, and price are required' });
    }

    const newPkg = dbStore.addPackage({
      name,
      tier,
      price: Number(price),
      album: album || 'Luxury Matte Album',
      drone: drone || '4K Drone Coverage',
      video: video || 'Cinematic Film + Teaser',
      photoCount: photoCount || '500+ Edited Photos',
      deliveryTime: deliveryTime || '10 Working Days',
      description: description || '',
      features: Array.isArray(features) ? features : [],
      isActive: isActive !== undefined ? isActive : true
    });

    return res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: newPkg
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create package',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// PUT update package (Admin)
router.put('/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const updated = dbStore.updatePackage(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    return res.json({
      success: true,
      message: 'Package updated successfully',
      data: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update package',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// DELETE package (Admin)
router.delete('/:id', requireAdminAuth, (req: Request, res: Response) => {
  const deleted = dbStore.deletePackage(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Package not found' });
  }

  return res.json({
    success: true,
    message: 'Package deleted successfully'
  });
});

export default router;
