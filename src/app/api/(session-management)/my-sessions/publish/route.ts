/**
 * POST /my-sessions/publish
 * 
 * Publishes a wellness session, either by updating an existing draft or creating a new one.
 * 
 * This endpoint fulfills the "Publish a session" requirement in the
 * Arvyax Full Stack Internship Assignment.
 * 
 * - Requires user authentication (JWT via cookie)
 * - Validates required fields (title and JSON file URL)
 * - Ensures session ownership and draft status before allowing update
 * - Converts tags from comma-separated input to array
 * - Responds with the published session
 */

import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/db"
import Session from "@/lib/models/Session"
import { getAuthUser } from "@/lib/auth/auth"

export async function POST(request: NextRequest) {
  try {
    // Authenticate the user
    const userId = await getAuthUser()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Extract fields from the request body
    const { id, title, tags, json_file_url } = await request.json()

    // Validate required fields
    if (!title || !json_file_url) {
      return NextResponse.json({ error: "Title and JSON file URL are required" }, { status: 400 })
    }

    // Process tags from comma-separated string to array
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
        { title, tags: processedTags, json_file_url, status: "published" },
        { new: true }
      )
    } else {
      // Create and publish a new session
      session = await Session.create({
        title,
        tags: processedTags,
        json_file_url,
        user_id: userId,
        status: "published",
      })
    }

    // Handle save failure
    if (!session) {
      return NextResponse.json({ error: "Failed to publish session" }, { status: 400 })
    }

    // Respond with the published session
    return NextResponse.json({
      message: "Session published successfully",
      session,
    })
  } catch (error) {
    // Handle unexpected server errors
    console.error("Publish session error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
