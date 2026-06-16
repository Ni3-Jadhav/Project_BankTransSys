const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");

const emailService = require("../services/email.service");

/**
 * * Transaction controller
 * * Create new transaction
 * * 10 Steps transaction process:
 *   - Validate request
 *   - Validate idempotency key
 *   - Check account status
 *   - Derive sender balance from ledger
 *   - Create transaction with PENDING status
 *   - Create DEBIT ledger entry
 *   - Create CREDIT ledger entry
 *   - Mark transaction as COMPLETED
 *   - Commit MongoDB session
 *   - Send email notification
 */

async function createTransaction(req, res) {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  /**
   * - Validate request
   */

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message:
        "fromAccont, toAccount, amount and idempotencyKey all are required for transaction",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
  });

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!fromUserAccount || !toUserAccount) {
    return res.status(400).json({
      meassage: "Invalid fromAccount and toAccount",
    });
  }

  /**
   * - Validate idempotency key
   */

  const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey: idempotencyKey,
  });

  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction Already processed",
        transaction: isTransactionAlreadyExists,
      });
    }

    if (isTransactionAlreadyExists.status === "PENDING") {
      return res.status(200).json({
        message: "Transaction is still processing",
      });
    }

    if (isTransactionAlreadyExists.status === "FAILED") {
      return res.status(500).json({
        message: "Transaction processing failed, please retry",
      });
    }

    if (isTransactionAlreadyExists.status === "REFUNDED") {
      return res.status(500).json({
        message: "Transaction processed with Refund",
      });
    }
  }

  /**
   * - Check account status
   */

  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(400).json({
      message:
        "Both fromAccount and toAccount must be ACTIVE to process transaction",
    });
  }

  /**
   * - Derive sender balance from ledger
   */

  const senderBalance = await fromUserAccount.getBalance();

  if (senderBalance < amount) {
    return res.status(400).json({
      message: `Insufficient balance. Current balance is ${senderBalance}. Requested amount is ${amount}`,
    });
  }
}
