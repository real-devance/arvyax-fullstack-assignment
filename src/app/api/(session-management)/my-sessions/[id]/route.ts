/**
 * GET /my-sessions/:id
 *
 * Retrieves a single session owned by the currently authenticated user.
 *
 * 🔹 Part of the session management API for the Arvyax Full Stack Internship Assignment.
 * 🔹 Ensures only the session owner can access it.
 * 🔹 Used on the frontend to view/edit a specific session from "My Sessions".
 *
 * Returns the session if found, otherwise responds with appropriate error.
 */

import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/db"
import Session from "@/lib/models/Session"
import { getAuthUser } from "@/lib/auth/auth"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Authenticate the user from the cookie-based token
    const userId = await getAuthUser()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Connect to MongoDB
    await connectDB()

    // Find the session by ID and ensure it belongs to the current user
    const session = await Session.findOne({
      _id: (await params).id,
      user_id: userId,
    })

    // If session is not found or not owned by user
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Return the session details
    return NextResponse.json({ session })
  } catch (error) {
    // Log and return server error
    console.error("Get session error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
