const express = require("express");

const authController = require("../controllers/auth.controller");

const router = express.Router();

/** - Create user route
 * Post api - api/auth/register
 */
router.post("/register", authController.userRegisterController);

/**
 * - User Login route
 * - Post api - api/auth/login
 */
router.post("/login", authController.userLoginController);

/**
 * - User Logout route with blacklist token
 * - Post api - api/auth/logout
 */

router.post("/logout", authController.userLogoutController);

module.exports = router;
