const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User ID is required for account creation"],
      index: true,
    },
    status: {
      enum: {
        values: ["ACTIVE", "FROZEN", "CLOSED"],
        message: "Status must be either ACTIVE, FROZEN, or CLOSED",
      },
    },
    currency: {
      type: String,
      required: [true, "Currency is required for account creation"],
      default: "INR",
      trim: true,
      uppercase: true,
    },
  },
  {
    timestamps: true,
  },
);

accountSchema.index({ userId: 1 }, { status: 1 });

const accountModel = mongoose.model("account", accountSchema);

module.exports = accountModel;
