/**
 * POST /logout
 * Logs the user out by clearing the auth token cookie.
 * Returns a success message if successful, or a 500 error on failure.
 */

import { NextResponse } from "next/server"
import { clearAuthCookie } from "@/lib/auth/auth"

export async function POST() {
  try {
    // Clear the authentication cookie to end the session
    await clearAuthCookie()

    // Respond with a success message
    return NextResponse.json({ message: "Logged out successfully" })
  } catch (error) {
    // Log and handle unexpected errors
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
