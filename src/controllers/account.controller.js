const accountModel = require("../models/account.model");

/**
 * - Account controller
 * - Handles account related operations such as creating new accounts, fetching account details, etc.
 */

async function createAccountController(req, res) {
  const user = req.user;

  try {
    const newAccount = await accountModel.create({
      userId: user._id,
    });
    return res.status(201).json({
      newAccount,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create account",
      error: error.message,
    });
  }
}

module.exports = {
  createAccountController,
};
