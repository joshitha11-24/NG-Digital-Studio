import { Booking } from './api';

export interface PhoneValidationResult {
  valid: boolean;
  formatted: string;
  error?: string;
}

/**
 * Validates and formats a phone number for WhatsApp click-to-chat.
 * For Indian numbers, strips non-digits and ensures the '91' country code prefix
 * without any spaces, '+', or hyphens.
 */
export function formatWhatsAppPhone(phone?: string | null): PhoneValidationResult {
  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    return {
      valid: false,
      formatted: '',
      error: 'Customer phone number is missing. Cannot open WhatsApp chat.'
    };
  }

  // Strip all non-digit characters
  const digits = phone.replace(/\D/g, '');

  if (!digits || digits.length < 10) {
    return {
      valid: false,
      formatted: '',
      error: `Invalid phone number "${phone}". A valid mobile number must have at least 10 digits.`
    };
  }

  if (digits.length > 15) {
    return {
      valid: false,
      formatted: '',
      error: `Invalid phone number "${phone}". The number exceeds standard international phone length.`
    };
  }

  // Case 1: Standard Indian 10-digit number (e.g. 9842178068)
  if (digits.length === 10) {
    return {
      valid: true,
      formatted: `91${digits}`
    };
  }

  // Case 2: 11-digit number starting with 0 (e.g. 09842178068)
  if (digits.length === 11 && digits.startsWith('0')) {
    return {
      valid: true,
      formatted: `91${digits.slice(1)}`
    };
  }

  // Case 3: 12-digit Indian number already starting with 91 (e.g. 919842178068)
  if (digits.length === 12 && digits.startsWith('91')) {
    return {
      valid: true,
      formatted: digits
    };
  }

  // Case 4: Other numbers with international country code (11-15 digits)
  // Strip any leading 00 if present
  const cleanedInternational = digits.replace(/^00/, '');
  if (cleanedInternational.length >= 10 && cleanedInternational.length <= 15) {
    return {
      valid: true,
      formatted: cleanedInternational
    };
  }

  return {
    valid: false,
    formatted: '',
    error: `Invalid phone number format "${phone}".`
  };
}

/**
 * Builds a polite, professional booking confirmation message template.
 */
export function buildBookingConfirmationMessage(booking: Partial<Booking>): string {
  const customerName = booking.customerName?.trim() || 'Valued Customer';
  const bookingId = booking.id || 'N/A';
  const serviceName = booking.serviceName || 'Photography Session';
  const packageName = booking.packageName || 'Standard Package';
  const eventDate = booking.eventDate || 'Scheduled Date';
  const venueLine = booking.eventVenue ? `• Venue: ${booking.eventVenue}\n` : '';

  return (
    `Hello ${customerName},\n\n` +
    `Thank you for choosing NG Digital Studio! We are pleased to confirm your booking.\n\n` +
    `📋 Booking Details:\n` +
    `• Booking ID: ${bookingId}\n` +
    `• Event Type: ${serviceName}\n` +
    `• Package: ${packageName}\n` +
    `• Event Date: ${eventDate}\n` +
    venueLine +
    `\nOur photography team is scheduled and prepared for your event. If you have any questions or custom requirements, please feel free to reply to this message.\n\n` +
    `Warm regards,\n` +
    `NG Digital Studio\n` +
    `39A/46 Hannumar Kovil Padithurai, Simmakkal, Madurai - 625001\n` +
    `Phone: +91 9842178068\n` +
    `Email: ng.digitalstudiomdu@gmail.com`
  );
}

/**
 * Builds a polite, professional booking rejection message template with the reason.
 */
export function buildBookingRejectionMessage(
  booking: Partial<Booking>,
  reason: string,
  notes?: string
): string {
  const customerName = booking.customerName?.trim() || 'Valued Customer';
  const bookingId = booking.id || 'N/A';
  const serviceName = booking.serviceName || 'Photography Session';
  const eventDate = booking.eventDate || 'Scheduled Date';
  const cleanReason = reason?.trim() || 'Slot unavailable for the requested date and time.';
  const notesLine = notes?.trim() ? `Additional Notes: ${notes.trim()}\n\n` : '';

  return (
    `Hello ${customerName},\n\n` +
    `Thank you for your interest in NG Digital Studio.\n\n` +
    `Regarding your booking request (${bookingId}) for ${serviceName} on ${eventDate}:\n` +
    `We regret to inform you that we are unable to accept this booking request at this time.\n\n` +
    `Reason: ${cleanReason}\n` +
    notesLine +
    `We sincerely apologize for any inconvenience caused and hope to have the opportunity to serve you for future events.\n\n` +
    `Warm regards,\n` +
    `NG Digital Studio\n` +
    `39A/46 Hannumar Kovil Padithurai, Simmakkal, Madurai - 625001\n` +
    `Phone: +91 9842178068\n` +
    `Email: ng.digitalstudiomdu@gmail.com`
  );
}

export interface WhatsAppUrlResult {
  url?: string;
  error?: string;
  phone?: string;
}

/**
 * Creates the https://wa.me/PHONE_NUMBER?text=ENCODED_MESSAGE URL for confirmation.
 */
export function getConfirmationWhatsAppUrl(booking: Partial<Booking>): WhatsAppUrlResult {
  const phoneValidation = formatWhatsAppPhone(booking.customerPhone);
  if (!phoneValidation.valid) {
    return { error: phoneValidation.error };
  }

  const message = buildBookingConfirmationMessage(booking);
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${phoneValidation.formatted}?text=${encodedMessage}`;

  return {
    url,
    phone: phoneValidation.formatted
  };
}

/**
 * Creates the https://wa.me/PHONE_NUMBER?text=ENCODED_MESSAGE URL for rejection.
 */
export function getRejectionWhatsAppUrl(
  booking: Partial<Booking>,
  reason: string,
  notes?: string
): WhatsAppUrlResult {
  const phoneValidation = formatWhatsAppPhone(booking.customerPhone);
  if (!phoneValidation.valid) {
    return { error: phoneValidation.error };
  }

  const message = buildBookingRejectionMessage(booking, reason, notes);
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${phoneValidation.formatted}?text=${encodedMessage}`;

  return {
    url,
    phone: phoneValidation.formatted
  };
}

/**
 * Opens the WhatsApp URL in a new browser tab/window for the admin to manually review and send.
 */
export function openWhatsAppChat(url: string): boolean {
  try {
    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    return !!opened;
  } catch (err) {
    console.error('Failed to open WhatsApp window:', err);
    return false;
  }
}

