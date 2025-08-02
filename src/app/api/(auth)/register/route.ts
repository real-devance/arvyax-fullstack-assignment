/**
 * POST /register
 * Handles user registration:
 * - Validates input fields
 * - Checks for duplicate accounts
 * - Hashes the password
 * - Stores new user in the database
 * - Generates JWT and sets it as an HTTP-only cookie
 */

import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/db"
import User from "@/lib/models/User"
import { hashPassword, generateToken } from "@/lib/auth/auth"

export async function POST(request: NextRequest) {
  try {
    // Extract email and password from the request body
    const { email, password } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Enforce minimum password length
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Connect to the database
    await connectDB()

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Hash the password for secure storage
    const password_hash = await hashPassword(password)

    // Create the new user in the database
    const user = await User.create({
      email,
      password_hash,
    })

    // Generate a JWT token for the new user
    const token = generateToken(user._id.toString())

    //  Create the response object
    const response = NextResponse.json({
      message: "User created successfully",
      user: {
        id: user._id,
        email: user.email,
      },
    })

    //  Store the token in an HTTP-only cookie for authentication
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    // ✅ Return the response with the cookie attached
    return response
  } catch (error) {
    // Log and handle any unexpected errors
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
