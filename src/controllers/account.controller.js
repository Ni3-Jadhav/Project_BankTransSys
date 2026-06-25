const accountModel = require("../models/account.model");

/**
 * - Account controller
 * - Handles account related operations such as creating new accounts, fetching account details, etc.
 */

/**
 * - Create new account for login user
 * - Post API- api/accounts
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
    console.error("Failed to create New Account", error.message);
  }
}

/**
 * - Fetch all account of login user
 * - Get API - api/accounts
 */

async function getAccountController(req, res) {
  const user = req.user;

  try {
    const accounts = await accountModel.find({ userId: user._id });
    return res.status(200).json({
      accounts,
    });
  } catch (error) {
    console.error("Failed to fetch login user accounts", error.message);
    return res.status(500).json({
      message: "Failed to fetch login user accounts",
      error: error.message,
    });
  }
}

/**
 * - Get Account balance by Id
 * - Api - /api/accounts/balance/:accountId
 */

async function getUserAccountBalanceController(req, res) {
  const { accountId } = req.params;

  try {
    const account = await accountModel.findOne({
      _id: accountId,
      userId: req.user._id,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    const balance = await account.getBalance();
    return res.status(200).json({
      accountId: account._id,
      balance: balance,
    });
  } catch (error) {
    console.error("Failed to fetch user account balance", error.message);
    return res.status(500).json({
      message: "Failed to fetch user account balance",
      error: error.message,
    });
  }
}

module.exports = {
  createAccountController,
  getAccountController,
  getUserAccountBalanceController,
};
