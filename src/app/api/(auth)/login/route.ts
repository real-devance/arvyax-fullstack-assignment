/**
 * POST /login
 * Handles user login by:
 * - Validating input fields
 * - Verifying credentials against stored user data
 * - Generating JWT for authentication
 * - Setting a secure HTTP-only cookie
 */


import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/db"
import User from "@/lib/models/User"
import { verifyPassword, generateToken } from "@/lib/auth/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    await connectDB()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = generateToken(user._id.toString())

    //  Create the response
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
      },
    })

    //  Set the cookie directly on the response
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
