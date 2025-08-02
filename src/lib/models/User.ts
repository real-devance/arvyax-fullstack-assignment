/**
 * Mongoose schema for storing user accounts.
 * Each user has a unique email and hashed password, along with a creation timestamp.
 * Used for authentication in the Arvyax assignment.
 */
import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  },
)

export default mongoose.models.User || mongoose.model("User", UserSchema)
