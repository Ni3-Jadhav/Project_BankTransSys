const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");

const emailService = require("../services/email.service");

const mongoose = require("mongoose");

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
  let transactionStarted = false;
  try {
    /**
     * - Validate request
     */

    if (!fromAccount || !toAccount || amount == null || !idempotencyKey) {
      return res.status(400).json({
        message:
          "fromAccount, toAccount, amount and idempotencyKey all are required for transaction",
      });
    }

    /**
     * - Validate Accounts
     */

    if (
      !mongoose.Types.ObjectId.isValid(fromAccount) ||
      !mongoose.Types.ObjectId.isValid(toAccount)
    ) {
      return res.status(400).json({
        message: "Invalid Account Id",
      });
    }

    const [senderAccount, receiverAccount] = await Promise.all([
      accountModel.findOne({
        _id: fromAccount,
      }),
      accountModel.findOne({
        _id: toAccount,
      }),
    ]);

    if (!senderAccount || !receiverAccount) {
      return res.status(400).json({
        message: "Invalid fromAccount and toAccount",
      });
    }

    if (fromAccount === toAccount) {
      return res.status(400).json({
        message: "Sender and receiver accounts cannot be the same.",
      });
    }
    /**
     * - Validate amount
     */

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        message: "Amount must be a positive number.",
      });
    }

    /**
     * - Validate idempotency key
     */

    const isTransactionAlreadyExists = await transactionModel.findOne({
      idempotencyKey: idempotencyKey,
    });

    if (isTransactionAlreadyExists) {
      const { status } = isTransactionAlreadyExists;
      if (status === "COMPLETED") {
        return res.status(200).json({
          message: "Transaction Already processed",
          transaction: isTransactionAlreadyExists,
        });
      }

      if (status === "PENDING") {
        return res.status(200).json({
          message: "Transaction is still processing",
        });
      }

      if (status === "FAILED") {
        return res.status(500).json({
          message: "Transaction processing failed, please retry",
        });
      }

      if (status === "REFUNDED") {
        return res.status(500).json({
          message: "Transaction processed with Refund",
        });
      }
    }

    /**
     * - Check account status
     */

    if (
      senderAccount.status !== "ACTIVE" ||
      receiverAccount.status !== "ACTIVE"
    ) {
      return res.status(400).json({
        message:
          "Both fromAccount and toAccount must be ACTIVE to process transaction",
      });
    }

    /**
     * - Derive sender balance from ledger
     */

    const senderBalance = await senderAccount.getBalance();

    if (senderBalance < amount) {
      return res.status(400).json({
        message: `Insufficient balance. Current balance is ${senderBalance}. Requested amount is ${amount}`,
      });
    }

    /**
     * * This all steps are dependent on each other, if 1 is missing then all steps also no
     * * need to complete or go further. So we use mongoose session for this.
     * - Create transaction with PENDING status
     * - Create DEBIT ledger entry
     * - Create CREDIT ledger entry
     * - Mark transaction as COMPLETED
     */

    let newTransaction;

    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      transactionStarted = true;
      newTransaction = new transactionModel({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING",
      });

      await newTransaction.save({ session });
      const debitLedgerEntry = new ledgerModel({
        account: fromAccount,
        amount: amount,
        transaction: newTransaction._id,
        transactionType: "DEBIT",
      });

      await debitLedgerEntry.save({ session });

      const creditLedgerEntry = new ledgerModel({
        account: toAccount,
        amount: amount,
        transaction: newTransaction._id,
        transactionType: "CREDIT",
      });

      await creditLedgerEntry.save({ session });

      newTransaction.status = "COMPLETED";
      await newTransaction.save({ session });

      /**
       * - Commit MongoDB session
       */

      await session.commitTransaction();
    } catch (error) {
      console.error("Transaction Session Error:", error);
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      throw error;
    } finally {
      await session.endSession();
    }

    /**
     * - Send email notification
     */
    try {
      await emailService.sendEmailOnSuccessfullTransaction(
        req.user.email,
        req.user.name,
        amount,
        toAccount,
        fromAccount,
      );
    } catch (error) {
      console.error("Email Error", error);
    }
    return res.status(201).json({
      message: "Transaction Completed successfully",
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("Transaction Error:", error);
    if (transactionStarted) {
      try {
        await emailService.sendEmailOnFailedTransaction(
          req.user.email,
          req.user.name,
          amount,
          toAccount,
          fromAccount,
        );
      } catch (error) {
        console.error("Email error", error);
      }
    }
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function createInitialSystemTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;
  let transactionStarted = false;
  try {
    if (!toAccount || !amount || !idempotencyKey) {
      return res.status(400).json({
        message:
          "toAccount, amount and idempotencyKey all are required for transaction",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(toAccount)) {
      return res.status(400).json({
        message: "Invalid Account Id",
      });
    }
    const receiverAccount = await accountModel.findOne({
      _id: toAccount,
    });

    if (!receiverAccount) {
      return res.status(400).json({
        message: "Invalid toAccount",
      });
    }

    if (receiverAccount.status !== "ACTIVE") {
      return res.status(400).json({
        message: "Receiver account must be ACTIVE.",
      });
    }
    const senderAccount = await accountModel.findOne({
      userId: req.user._id,
    });

    if (!senderAccount) {
      return res.status(400).json({
        message: "System user account not found",
      });
    }

    if (senderAccount._id === toAccount) {
      return res.status(400).json({
        message: "System account and target account must be different.",
      });
    }

    if (senderAccount.status !== "ACTIVE") {
      return res.status(400).json({
        message: "Sender account must be ACTIVE.",
      });
    }
    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        message: "Amount must be a positive number.",
      });
    }

    let initialTransaction;
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      transactionStarted = true;
      initialTransaction = new transactionModel({
        fromAccount: senderAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING",
      });

      await initialTransaction.save({ session });
      const debitLedgerEntry = new ledgerModel({
        account: senderAccount._id,
        amount: amount,
        transaction: initialTransaction._id,
        transactionType: "DEBIT",
      });

      await debitLedgerEntry.save({ session });
      const creditLedgerEntry = new ledgerModel({
        account: toAccount,
        amount: amount,
        transaction: initialTransaction._id,
        transactionType: "CREDIT",
      });

      await creditLedgerEntry.save({ session });
      initialTransaction.status = "COMPLETED";
      await initialTransaction.save({ session });

      await session.commitTransaction();
    } catch (error) {
      console.error(" Transaction Session Error:", error);

      if (session.inTransaction()) {
        await session.abortTransaction();
      }

      throw error;
    } finally {
      await session.endSession();
    }

    try {
      await emailService.sendEmailOnSuccessfullTransaction(
        req.user.email,
        req.user.name,
        amount,
        toAccount,
        senderAccount._id,
      );
    } catch (error) {
      console.error("Email Error", error);
    }

    return res.status(201).json({
      message: "Transaction Completed successfully",
      transaction: initialTransaction,
    });
  } catch (error) {
    console.error("Transaction Error:", error);
    if (transactionStarted) {
      try {
        await emailService.sendEmailOnFailedTransaction(
          req.user.email,
          req.user.name,
          amount,
          toAccount,
        );
      } catch (error) {
        console.error("Email error", error);
      }
    }
    return res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  createTransaction,
  createInitialSystemTransaction,
};
