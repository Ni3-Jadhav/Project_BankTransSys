const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const accountController = require("../controllers/account.controller");

/**
 * - Account routes
 * - POST api - api/account
 * - Create new account for authenticated user
 * - Protected route, requires authentication
 */

router.post("/", authMiddleware.authMiddleware, accountController.createAccountController);

module.exports = router;