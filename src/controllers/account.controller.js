const mongoose = require("mongoose");
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
    const accountCount = await accountModel.countDocuments({
      userId: user._id,
    });

    if (accountCount >= 5) {
      return res.status(400).json({
        message: "You can create a maximum of 5 accounts.",
      });
    }

    const newAccount = await accountModel.create({
      userId: user._id,
    });

    return res.status(201).json({
      newAccount,
    });
  } catch (error) {
    console.error("Failed to create New Account", error.message);
    return res.status(500).json({
      message: "Failed to create account",
    });
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
    });
  }
}

/**
 * - Get Account balance by Id
 * - Api - /api/accounts/balance/:accountId
 */

async function getUserAccountBalanceController(req, res) {
  const { accountId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(accountId)) {
    return res.status(400).json({
      message: "Invalid Account ID",
    });
  }
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

    if (account.status !== "ACTIVE") {
      return res.status(403).json({
        message: `Account is ${account.status}`,
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
    });
  }
}

/**
 * - Get User account balance by system user
 * - GET API - api/accounts/sysBal/:accountId
 */

async function getUserAccountBalBySysUser(req, res) {
  const { accountId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(accountId)) {
    return res.status(400).json({
      message: "Invalid Account ID",
    });
  }
  try {
    const account = await accountModel.findById(accountId);

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
    });
  }
}

/**
 * - Update Account Status by system user only
 * - PUT API - api/accounts/status/:accountId
 */
async function updateAccountStatusController(req, res) {
  const { accountId } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(accountId)) {
    return res.status(400).json({
      message: "Invalid Account ID",
    });
  }

  if (!status) {
    return res.status(400).json({
      message: "Status is required",
    });
  }

  const validStatuses = ["ACTIVE", "FROZEN", "CLOSED"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid account status",
    });
  }

  try {
    const updatedAccount = await accountModel.findByIdAndUpdate(
      accountId,
      { status },
      { new: true, runValidators: true },
    );

    if (!updatedAccount) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    return res.status(200).json({
      message: "Account status updated successfully",
      account: updatedAccount,
    });
  } catch (error) {
    console.error("Failed to update account status", error.message);
    return res.status(500).json({
      message: "Failed to update account status",
    });
  }
}

module.exports = {
  createAccountController,
  getAccountController,
  getUserAccountBalanceController,
  getUserAccountBalBySysUser,
  updateAccountStatusController,
};
