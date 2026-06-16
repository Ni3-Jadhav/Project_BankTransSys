const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

/**
 * * Create new transaction
 * * - Transaction POST API - api/transaction
 */

router.post("/", authMiddleware.authMiddleware);

module.exports = router;
