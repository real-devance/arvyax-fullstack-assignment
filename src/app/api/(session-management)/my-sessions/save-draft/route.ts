/**
 * POST /my-sessions/save-draft
 * 
 * Saves a new draft session or updates an existing one.
 * 
 * This endpoint is part of the core session management API as defined in the
 * Arvyax Full Stack Internship Assignment.
 * 
 * - Authenticates the user using the auth token (via cookie)
 * - Validates required fields (title and JSON file URL)
 * - Processes tag input from a comma-separated string
 * - If an ID is provided, updates an existing draft owned by the user
 * - Otherwise, creates a new draft session with "draft" status
 * 
 * Used by the frontend "Session Editor" to auto-save or manually save sessions in draft form.
 */

import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/db"
import Session from "@/lib/models/Session"
import { getAuthUser } from "@/lib/auth/auth"

export async function POST(request: NextRequest) {
  try {
    // Authenticate user from the JWT cookie
    const userId = await getAuthUser()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Extract and validate required fields from request body
    const { id, title, tags, json_file_url } = await request.json()
    if (!title || !json_file_url) {
      return NextResponse.json({ error: "Title and JSON file URL are required" }, { status: 400 })
    }

    // Process comma-separated tags into trimmed array
    const processedTags = tags
      ? tags
          .split(",")
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag.length > 0)
      : []

    // Connect to MongoDB
    await connectDB()

    let session

    // If session ID is provided, try to update an existing draft
    if (id) {
      const existingSession = await Session.findOne({ _id: id, user_id: userId })
      if (!existingSession) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 })
      }

      if (existingSession.status === "published") {
        return NextResponse.json({ error: "Cannot modify published sessions" }, { status: 400 })
      }

      session = await Session.findOneAndUpdate(
        { _id: id, user_id: userId, status: "draft" },
        { title, tags: processedTags, json_file_url, status: "draft" },
        { new: true }
      )
    } else {
      // Otherwise, create a new draft session
      session = await Session.create({
        title,
        tags: processedTags,
        json_file_url,
        user_id: userId,
        status: "draft",
      })
    }

    // Handle unexpected failure
    if (!session) {
      return NextResponse.json({ error: "Failed to save draft" }, { status: 400 })
    }

    // Return success with updated/created session
    return NextResponse.json({
      message: "Draft saved successfully",
      session,
    })
  } catch (error) {
    // Handle unexpected server errors
    console.error("Save draft error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
