/**
 * Mongoose schema for wellness sessions linked to a user.
 * Includes title, tags, JSON file URL, and a status (draft or published),
 * along with automatic creation and update timestamps.
 * Built to support session management in the Arvyax assignment.
 */
import mongoose from "mongoose"

const SessionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    json_file_url: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
)

export default mongoose.models.Session || mongoose.model("Session", SessionSchema)
