-- ==========================================================
-- NG DIGITAL STUDIO - MySQL DATABASE SCHEMA
-- Photography Studio Management & Booking System
-- ==========================================================

CREATE DATABASE IF NOT EXISTS ng_digital_studio;
USE ng_digital_studio;

-- 1. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS admin_users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL
);

-- 2. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50) NOT NULL,
  address VARCHAR(255) NULL,
  city VARCHAR(100) DEFAULT 'Madurai',
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. PACKAGES TABLE (Silver, Gold, Premium, etc.)
CREATE TABLE IF NOT EXISTS packages (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  tier VARCHAR(50) NOT NULL, -- Silver, Gold, Premium
  price DECIMAL(10, 2) NOT NULL,
  album VARCHAR(255) NOT NULL,
  drone VARCHAR(100) NOT NULL,
  video VARCHAR(255) NOT NULL,
  photo_count VARCHAR(100) NOT NULL,
  delivery_time VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  features JSON NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(64) PRIMARY KEY,
  customer_name VARCHAR(150) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  service_id VARCHAR(100) NOT NULL,
  service_name VARCHAR(150) NOT NULL,
  package_id VARCHAR(64) NULL,
  package_name VARCHAR(100) NOT NULL,
  event_date DATE NOT NULL,
  booking_date DATE NOT NULL,
  event_venue VARCHAR(255) NULL,
  event_reason VARCHAR(255) NOT NULL,
  expectations TEXT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  advance_amount DECIMAL(10, 2) DEFAULT 0.00,
  status ENUM('Pending', 'Confirmed', 'Rejected', 'Completed', 'Cancelled') DEFAULT 'Pending',
  rejection_reason TEXT NULL,
  admin_notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. GALLERY TABLE
CREATE TABLE IF NOT EXISTS gallery (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  category ENUM(
    'Wedding',
    'Birthday',
    'Pre-Wedding',
    'Post-Wedding',
    'Outdoor Shoot',
    'Baby Shower',
    'Engagement',
    'Housewarming',
    'Product Shoot'
  ) NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT NULL,
  description TEXT NULL,
  location VARCHAR(150) DEFAULT 'Madurai',
  tags JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(64) PRIMARY KEY,
  client_name VARCHAR(150) NOT NULL,
  service VARCHAR(150) NOT NULL,
  review_text TEXT NOT NULL,
  rating INT DEFAULT 5,
  location VARCHAR(100) DEFAULT 'Madurai',
  avatar TEXT NULL,
  status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 7. EMAIL AUDIT LOGS
CREATE TABLE IF NOT EXISTS email_logs (
  id VARCHAR(64) PRIMARY KEY,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  email_type ENUM('Booking_Confirmation', 'Booking_Rejection', 'Admin_Alert', 'Customer_Welcome') NOT NULL,
  status VARCHAR(50) DEFAULT 'Sent',
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SEED INITIAL WEDDING PACKAGES (Budget, Luxury, Semi-Luxury)
INSERT INTO packages (id, name, tier, price, album, drone, video, photo_count, delivery_time, description, features)
VALUES 
(
  'pkg-budget',
  'BUDGET',
  'Silver',
  35000.00,
  '15 × 10 Album with 30 Pages',
  'Optional Add-on (Contact Studio)',
  'HD Video',
  '300+ Color-Graded High-Res Photos',
  '15 Working Days',
  'Essential traditional coverage with HD video, 15 × 10 album with 30 pages, pendrive, photo frame, and bag.',
  '["Traditional Photographer", "HD Video", "15 × 10 Album with 30 Pages", "Pendrive", "Photo Frame", "Bag"]'
),
(
  'pkg-luxury',
  'LUXURY',
  'Gold',
  50000.00,
  '15 × 10 Album with 60 Pages',
  'Optional Add-on (Contact Studio)',
  'HD Video',
  '500+ Edited High-Res Photos',
  '10 Working Days',
  'Luxury coverage combining traditional & candid photography, HD video, 60-page 15 × 10 album, pendrive, frame, and bag.',
  '["Traditional Photographer", "HD Video", "Candid Photography", "15 × 10 Album with 60 Pages", "Pendrive", "Photo Frame", "Bag"]'
),
(
  'pkg-semi-luxury',
  'SEMI-LUXURY',
  'Premium',
  65000.00,
  '15 × 10 Album with 60 Pages',
  'Optional Add-on (Contact Studio)',
  'HD Video + Candid Videography',
  '700+ Master-Edited Masterpiece Photos',
  '7 Working Days',
  'Semi-luxury cinematic suite featuring traditional photography, HD video, candid photography, candid videography, 60-page album, pendrive, frame, and bag.',
  '["Traditional Photographer", "HD Video", "Candid Photography", "Candid Videography", "15 × 10 Album with 60 Pages", "Pendrive", "Photo Frame", "Bag"]'
),
(
  'pkg-gen-budget',
  'BUDGET (Birthdays, Puberty & Shoots)',
  'Silver',
  30000.00,
  '15 × 10 Album with 30 Pages',
  'Optional Add-on (Contact Studio)',
  'HD Video',
  '300+ Color-Graded High-Res Photos',
  '12 Working Days',
  'Essential celebration coverage for birthdays, puberty ceremonies, and studio/outdoor shoots with traditional photography, HD video, 15 × 10 album, pendrive, frame, and bag.',
  '["Traditional Photographer", "HD Video", "15 × 10 Album with 30 Pages", "Pendrive", "Photo Frame", "Bag"]'
),
(
  'pkg-gen-luxury',
  'LUXURY (Birthdays, Puberty & Shoots)',
  'Gold',
  40000.00,
  '15 × 10 Album with 60 Pages',
  'Optional Add-on (Contact Studio)',
  'HD Video',
  '500+ Edited High-Res Photos',
  '10 Working Days',
  'Luxury celebration coverage combining traditional & candid photography with HD video, expanded 60-page 15 × 10 album, pendrive, frame, and bag.',
  '["Traditional Photographer", "HD Video", "Candid Photography", "15 × 10 Album with 60 Pages", "Pendrive", "Photo Frame", "Bag"]'
),
(
  'pkg-gen-semi-luxury',
  'SEMI-LUXURY (Birthdays, Puberty & Shoots)',
  'Premium',
  60000.00,
  '15 × 10 Album with 60 Pages',
  'Optional Add-on (Contact Studio)',
  'HD Video + Candid Videography',
  '700+ Master-Edited Masterpiece Photos',
  '7 Working Days',
  'Complete comprehensive cinema suite featuring traditional photography, candid photography, HD video, candid videography, and 60-page album.',
  '["Traditional Photographer", "HD Video", "Candid Photography", "Candid Videography", "15 × 10 Album with 60 Pages", "Pendrive", "Photo Frame", "Bag"]'
)
ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price), features=VALUES(features);
