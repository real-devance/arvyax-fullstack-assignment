/**
 * Utility to connect to MongoDB using Mongoose.
 * Prevents redundant connections and logs the connection state.
 * Required for backend data access in the Arvyax assignment.
 */
import mongoose from "mongoose"

type ConnectionObject = {
  isConnected?: number
}

const connection: ConnectionObject = {}

async function connectDB(): Promise<void> {
  if (connection.isConnected) {
    console.log("MongoDB is already connected")
    return
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {})
    connection.isConnected = db.connections[0].readyState
    console.log("MongoDB connected successfully:", connection.isConnected)
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw new Error("Failed to connect to MongoDB")
  }
}

export default connectDB
