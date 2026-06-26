const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const accountController = require("../controllers/account.controller");

/**
 * - Account routes
 * - POST Api - api/accounts
 * - Create new account for authenticated user
 * - Protected route, requires authentication
 */

router.post(
  "/",
  authMiddleware.authMiddleware,
  accountController.createAccountController,
);

/**
 * - Get Api - api/accounts
 * - Get all accounts for login user
 */

router.get(
  "/",
  authMiddleware.authMiddleware,
  accountController.getAccountController,
);

/**
 * - Get Api - /api/accounts/balance/:accountId
 * - Get user account balance
 */

router.get(
  "/balance/:accountId",
  authMiddleware.authMiddleware,
  accountController.getUserAccountBalanceController,
);

module.exports = router;
