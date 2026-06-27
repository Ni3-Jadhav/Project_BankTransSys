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

/**
 * - Get Api - api/accounts/sysBal/:accountId
 * - Get user all type account balance by System user
 */

router.get(
  "/sysBal/:accountId",
  authMiddleware.authSystemUserMiddleware,
  accountController.getUserAccountBalBySysUser,
);

/**
 * - Put Api -  api/accounts/status/:accountId
 * - Update account status only by system user
 */

router.put(
  "/status/:accountId",
  authMiddleware.authSystemUserMiddleware,
  accountController.updateAccountStatusController,
);

module.exports = router;
