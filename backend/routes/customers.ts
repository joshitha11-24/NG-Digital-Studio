import { Router, Request, Response } from 'express';
import { dbStore } from '../config/db';
import { requireAdminAuth } from '../middleware/auth';

const router = Router();

// GET all customers with search and booking history
router.get('/', requireAdminAuth, (req: Request, res: Response) => {
  const query = req.query.q as string | undefined;
  const customers = dbStore.getAllCustomers(query);
  return res.json({
    success: true,
    count: customers.length,
    data: customers
  });
});

// GET single customer details with their bookings
router.get('/:id', requireAdminAuth, (req: Request, res: Response) => {
  const customer = dbStore.getCustomerById(req.params.id);
  if (!customer) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }

  const customerBookings = dbStore.getAllBookings().filter(
    (b) => b.customerEmail.toLowerCase() === customer.email.toLowerCase()
  );

  return res.json({
    success: true,
    data: {
      ...customer,
      bookings: customerBookings
    }
  });
});

// POST create / register customer (Public or Admin)
router.post('/', (req: Request, res: Response) => {
  const { name, email, phone, city, address, notes } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required' });
  }

  const customer = dbStore.addCustomer({
    name: name.trim(),
    email: email.trim(),
    phone: phone ? phone.trim() : '',
    city: city ? city.trim() : 'Madurai',
    address: address ? address.trim() : '',
    notes: notes ? notes.trim() : 'Client registered'
  });

  return res.status(201).json({
    success: true,
    message: 'Customer registered successfully',
    data: customer
  });
});

// POST deduplicate customers (Admin only)
router.post('/deduplicate', requireAdminAuth, (req: Request, res: Response) => {
  const result = dbStore.deduplicateCustomers();
  return res.json({
    success: true,
    message: `Removed ${result.removed} duplicate customer records. ${result.remaining} unique clients remaining.`,
    data: result
  });
});

// DELETE single customer (Admin only)
router.delete('/:id', requireAdminAuth, (req: Request, res: Response) => {
  const success = dbStore.deleteCustomer(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, message: 'Customer record not found' });
  }
  return res.json({
    success: true,
    message: 'Customer deleted successfully'
  });
});

// DELETE all customers (Admin only, requires confirm=true)
router.delete('/', requireAdminAuth, (req: Request, res: Response) => {
  if (req.query.confirm !== 'true') {
    return res.status(400).json({ success: false, message: 'Must provide confirm=true to clear all customers' });
  }
  dbStore.clearAllCustomers();
  return res.json({
    success: true,
    message: 'All customer records cleared'
  });
});

export default router;
