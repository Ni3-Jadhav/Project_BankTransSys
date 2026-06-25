const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Ledger entry must be associated with an account"],
      index: true,
      immutable: true,
    },

    amount: {
      type: Number,
      required: [true, "Ledger entry amount is required"],
      min: [0, "Ledger entry amount must be greater than or equal to 0"],
      immutable: true,
    },

    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transaction",
      required: [true, "Ledger entry must be associated with a transaction"],
      index: true,
      immutable: true,
    },

    transactionType: {
      type: String,
      enum: {
        values: ["DEBIT", "CREDIT"],
        message: "Transaction type must be either DEBIT or CREDIT",
      },
      required: [
        true,
        "Transaction type is required for ledger entry creation",
      ],
      immutable: true,
    },
  },
  {
    timestamps: true,
  },
);

const preventLedgerModification = () => {
  throw new Error("Ledger entries cannot be modified after creation");
};

ledgerSchema.pre("findOneAndUpdate", preventLedgerModification);
ledgerSchema.pre("updateOne", preventLedgerModification);
ledgerSchema.pre("updateMany", preventLedgerModification);
ledgerSchema.pre("remove", preventLedgerModification);
ledgerSchema.pre("deleteOne", preventLedgerModification);
ledgerSchema.pre("deleteMany", preventLedgerModification);
ledgerSchema.pre("findOneAndDelete", preventLedgerModification);
ledgerSchema.pre("findOneAndRemove", preventLedgerModification);
ledgerSchema.pre("findOneAndReplace", preventLedgerModification);
ledgerSchema.pre("replaceOne", preventLedgerModification);

const ledgerModel = mongoose.model("ledger", ledgerSchema);

module.exports = ledgerModel;
