const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");

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
}
