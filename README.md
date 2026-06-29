# Bank Transaction System

A secure backend application built with Node.js, Express.js, and MongoDB for managing user authentication, bank accounts, and transaction operations.

## Live Demo
- Website: https://bank-ledger-h449.onrender.com/

## Features
- User registration and login
- JWT-based authentication
- Account management
- Deposit, withdrawal, and transfer transactions
- Transaction ledger tracking
- Secure logout with token blacklisting
- Email notifications for account-related actions

## Tech Stack
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT
- bcryptjs
- Cookie Parser
- Nodemailer

## Project Structure
- src/app.js - Main Express application setup
- src/routes/ - Route definitions for auth, accounts, and transactions
- src/controllers/ - Business logic for each feature
- src/models/ - MongoDB schemas
- src/middleware/ - Authentication and request handling middleware
- src/services/ - External services such as email

## Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file in the project root and add the required environment variables
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables
Create a .env file with values similar to:

```env
PORT=5050
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

## API Overview
- Auth routes: /api/auth
- Account routes: /api/accounts
- Transaction routes: /api/transaction

## Running the Project
- Development mode:
  ```bash
  npm run dev
  ```
- Production mode:
  ```bash
  npm start
  ```

## Notes
This project is designed as a simple banking-style transaction system for learning and demonstration purposes.
