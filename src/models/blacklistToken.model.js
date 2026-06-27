const mongoose = require("mongoose");

const blacklistTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required to Blacklist"],
      unique: [true, "Token is already Blacklisted"],
    },
  },
  {
    timestamps: true,
  },
);

blacklistTokenSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24 * 3, // 3 days
  },
);

const blacklistTokenModel = mongoose.model(
  "tokenBlacklist",
  blacklistTokenSchema,
);

module.exports = blacklistTokenModel;
