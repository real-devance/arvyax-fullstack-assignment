/**
 * GET /my-sessions
 * 
 * Retrieves all sessions (drafts and published) created by the authenticated user.
 * 
 * This route fulfills the "View your own sessions" requirement in the
 * Arvyax Full Stack Internship Assignment.
 * 
 * - Requires authentication (JWT via cookie)
 * - Returns sessions sorted by last updated date (newest first)
 * - Used on the frontend "My Sessions" page to display user's saved work
 */

import { NextResponse } from "next/server"
import connectDB from "@/lib/db/db"
import Session from "@/lib/models/Session"
import { getAuthUser } from "@/lib/auth/auth"

export async function GET() {
  try {
    // Authenticate the user via JWT stored in cookie
    const userId = await getAuthUser()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Connect to MongoDB
    await connectDB()

    // Fetch all sessions created by the authenticated user, sorted by last update
    const sessions = await Session.find({ user_id: userId }).sort({ updated_at: -1 })

    // Return sessions to the frontend
    return NextResponse.json({ sessions })
  } catch (error) {
    // Handle unexpected server errors
    console.error("Get my sessions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
