# Bank Transaction System

A compact and secure backend project for managing basic banking operations such as user authentication, account creation, deposits, withdrawals, and fund transfers. It is built to demonstrate how a real-world transaction system can be structured using Node.js, Express.js, and MongoDB.

## Live Demo
- Website: https://bank-ledger-h449.onrender.com/

## What This Project Does
This application provides a simple banking workflow where users can register, sign in, manage their accounts, and perform financial transactions. Each action is handled through RESTful APIs and stored in a MongoDB database for tracking and accountability.

## Key Features
- User registration and login
- Secure JWT-based authentication
- Account creation and management
- Deposit, withdrawal, and transfer operations
- Transaction ledger history
- Logout with token blacklisting for added security
- Email notifications for important actions

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
- src/routes/ - API routes for authentication, accounts, and transactions
- src/controllers/ - Business logic for each feature
- src/models/ - MongoDB schemas and data models
- src/middleware/ - Authentication and request handling middleware
- src/services/ - External services such as email handling

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
This project is ideal for learning backend development, REST API design, authentication flow, and MongoDB-based transaction handling in a simple banking scenario.
