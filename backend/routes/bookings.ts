import { Router, Request, Response } from 'express';
import { dbStore, BookingRecord } from '../config/db';
import { requireAdminAuth } from '../middleware/auth';
import { 
  sendBookingConfirmationEmail, 
  sendBookingRejectionEmail, 
  sendAdminNewBookingAlert 
} from '../services/emailService';

const router = Router();

// GET all bookings (Admin only)
router.get('/', requireAdminAuth, (req: Request, res: Response) => {
  const status = req.query.status as string | undefined;
  const bookings = dbStore.getAllBookings(status);
  return res.json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// GET booking by ID
router.get('/:id', (req: Request, res: Response) => {
  const booking = dbStore.getBookingById(req.params.id);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  return res.json({ success: true, data: booking });
});

// POST create booking (Called from Customer Website "Book Now" flow)
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      serviceId,
      serviceName,
      packageId,
      packageName,
      basePackagePrice,
      includedServices,
      customizations,
      customizationStatus,
      eventDate,
      bookingDate,
      eventVenue,
      eventReason,
      expectations,
      amount,
      advanceAmount
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !serviceName || !eventDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking fields (Name, Email, Phone, Service, Event Date)'
      });
    }

    const newBooking = dbStore.createBooking({
      customerName,
      customerEmail,
      customerPhone,
      serviceId: serviceId || 'custom-shoot',
      serviceName,
      packageId,
      packageName: packageName || 'Custom Photography Package',
      basePackagePrice: basePackagePrice || (amount ? `₹${Number(amount).toLocaleString('en-IN')}` : undefined),
      includedServices: Array.isArray(includedServices) ? includedServices : undefined,
      customizations: Array.isArray(customizations) ? customizations : [],
      customizationStatus: customizationStatus || (customizations && customizations.length > 0 ? 'Contact Studio for Additional Pricing' : 'Standard Package'),
      eventDate,
      bookingDate: bookingDate || new Date().toISOString().split('T')[0],
      eventVenue: eventVenue || 'Madurai',
      eventReason: eventReason || 'Studio Shoot',
      expectations: expectations || 'Natural candid photography and prompt album delivery.',
      amount: Number(amount) || 25000,
      advanceAmount: Number(advanceAmount) || 0
    });

    // Send Admin Alert Email
    await sendAdminNewBookingAlert(newBooking);

    return res.status(201).json({
      success: true,
      message: 'Booking request registered successfully with status Pending',
      data: newBooking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// PUT Confirm Booking (Admin only) -> Sends Confirmation Email to Customer
router.put('/:id/confirm', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const booking = dbStore.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const { adminNotes } = req.body;
    const updated = dbStore.updateBookingStatus(booking.id, 'Confirmed', undefined, adminNotes);

    if (updated) {
      // Send confirmation email
      await sendBookingConfirmationEmail(updated);
    }

    return res.json({
      success: true,
      message: `Booking ${booking.id} confirmed and email notification dispatched to ${booking.customerEmail}`,
      data: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to confirm booking',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// PUT Reject Booking (Admin only) -> Sends Rejection Email to Customer
router.put('/:id/reject', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const booking = dbStore.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const { reason, adminNotes } = req.body;
    const rejectionReason = reason || 'Date slot fully committed with senior crew.';
    const updated = dbStore.updateBookingStatus(booking.id, 'Rejected', rejectionReason, adminNotes);

    if (updated) {
      // Send rejection notification email
      await sendBookingRejectionEmail(updated, rejectionReason);
    }

    return res.json({
      success: true,
      message: `Booking ${booking.id} rejected and notice dispatched to ${booking.customerEmail}`,
      data: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to reject booking',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// PUT Update Status general
router.put('/:id/status', requireAdminAuth, (req: Request, res: Response) => {
  const { status, adminNotes } = req.body;
  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required' });
  }

  const updated = dbStore.updateBookingStatus(req.params.id, status as BookingRecord['status'], undefined, adminNotes);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  return res.json({
    success: true,
    message: `Booking status updated to ${status}`,
    data: updated
  });
});

// POST deduplicate bookings (Admin only)
router.post('/deduplicate', requireAdminAuth, (req: Request, res: Response) => {
  const result = dbStore.deduplicateBookings();
  return res.json({
    success: true,
    message: `Removed ${result.removed} duplicate bookings. ${result.remaining} bookings remaining.`,
    data: result
  });
});

// DELETE single booking (Admin only)
router.delete('/:id', requireAdminAuth, (req: Request, res: Response) => {
  const success = dbStore.deleteBooking(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  return res.json({
    success: true,
    message: 'Booking deleted successfully'
  });
});

// DELETE all bookings (Admin only, requires confirm=true)
router.delete('/', requireAdminAuth, (req: Request, res: Response) => {
  if (req.query.confirm !== 'true') {
    return res.status(400).json({ success: false, message: 'Must provide confirm=true to clear all bookings' });
  }
  dbStore.clearAllBookings();
  return res.json({
    success: true,
    message: 'All booking records cleared'
  });
});

export default router;
