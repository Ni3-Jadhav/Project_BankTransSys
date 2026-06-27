const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const transactionController = require("../controllers/transaction.controller");

/**
 * * Create transaction
 * * - Transaction POST API - api/transaction
 */

router.post(
  "/",
  authMiddleware.authMiddleware,
  transactionController.createTransaction,
);

/**
 * - Create initial funds transaction from SYSTEM user
 * - POST API - api/transaction/system/initial-funds
 */

router.post(
  "/system/initial-funds",
  authMiddleware.authSystemUserMiddleware,
  transactionController.createInitialSystemTransaction,
);

module.exports = router;
