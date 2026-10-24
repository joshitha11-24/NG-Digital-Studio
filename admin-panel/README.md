# NG Digital Studio - Admin Panel

This is the completely separate React application for the **NG Digital Studio Admin Panel**, independent of the customer-facing website.

## Tech Stack
- **Framework:** React.js (Vite)
- **Authentication:** Firebase Authentication
- **Design:** Modern Luxury Dark Photography Studio Theme (Tailwind CSS)
- **Icons:** Lucide React
- **API Client:** REST API client connecting to the Node.js/Express Backend (`/api`)

## Features
- **Admin Login:** Firebase Auth email & password sign-in (no hardcoded passwords in client storage)
- **Dashboard:** Live studio overview cards (Total Customers, Total Bookings, Pending, Confirmed, Total Packages, Total Reviews), recent bookings with status badges, recent customers, and studio quick actions
- **Customer Management:** View client directory, search by name/email/phone, view past booking histories and expectations
- **Booking Management:** Complete booking workflow with status filter (All, Pending, Confirmed, Rejected, Completed, Cancelled). Confirm booking triggers real-time confirmation email; Reject booking prompts for reason and dispatches rejection email
- **Package Management:** Silver, Gold, and Premium wedding package catalog. Add, edit, and delete packages, configure deliverables (Album, Drone, 4K Video, Photo Count, Delivery Time)
- **Gallery Management:** 9 Ceremony categories (Wedding, Birthday, Pre-Wedding, Post-Wedding, Outdoor Shoot, Baby Shower, Engagement, Housewarming, Product Shoot). Filter, add photos, and delete
- **Review Management:** Review moderation system. Only reviews approved by admin are published live on the customer website
- **Admin Sidebar:** Responsive mobile-collapsible navigation with pending count badges and secure logout

## Run Locally
```bash
cd admin-panel
npm install
npm run dev
```
The Admin Panel will start on `http://localhost:3001`.

## Deployment to Netlify
Build command: `npm run build`
Publish directory: `dist`
