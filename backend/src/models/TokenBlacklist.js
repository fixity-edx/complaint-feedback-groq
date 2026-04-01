import mongoose from "mongoose";

/**
 * Logout token invalidation via blacklist.
 * TTL index removes expired tokens automatically.
 */
const tokenBlacklistSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("TokenBlacklist", tokenBlacklistSchema);
