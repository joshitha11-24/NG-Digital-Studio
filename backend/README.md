# NG Digital Studio - Backend REST API & MySQL Data Service

This is the central Node.js & Express.js backend API and MySQL database service serving both the **Customer Website** and the **Separate Admin Panel**.

## Tech Stack
- **Runtime:** Node.js & Express.js
- **Database:** MySQL (`ng_digital_studio` schema with tables for `admin_users`, `customers`, `packages`, `bookings`, `gallery`, `reviews`, `email_logs`)
- **Email Service:** Automated transactional email engine for booking confirmation, booking rejection, and new booking admin alerts
- **Auth:** Firebase Admin Token validation & Admin session header authentication

## Database Setup
Import the database schema:
```bash
mysql -u root -p < schema.sql
```

## Environment Variables (.env)
```env
PORT=5000
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=ng_digital_studio
ADMIN_STUDIO_EMAIL=ngdigitalstudio@gmail.com
```

## Run Locally
```bash
cd backend
npm install
npm start
```
REST API runs on `http://localhost:5000/api`.
