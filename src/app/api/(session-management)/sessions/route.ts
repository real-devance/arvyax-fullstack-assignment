/**
 * GET /sessions
 * Public endpoint to fetch all published wellness sessions.
 * Sessions are populated with user email and sorted by latest first.
 */

import { NextResponse } from "next/server"
import connectDB from "@/lib/db/db"
import Session from "@/lib/models/Session"
import "@/lib/models/User"

export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB()

    // Fetch all published sessions, populate user email, sort by newest
    const sessions = await Session.find({ status: "published" })
      .populate("user_id", "email")
      .sort({ created_at: -1 })

    // Return sessions as JSON
    return NextResponse.json({ sessions })
  } catch (error) {
    // Handle unexpected errors
    console.error("Error fetching sessions:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
