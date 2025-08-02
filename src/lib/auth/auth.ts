/**
 * Authentication utility functions using bcrypt, JWT, and cookies.
 * Supports secure password handling, token generation/validation,
 * and session persistence via HTTP-only cookies.
 * Fulfills auth flow for the Arvyax assignment.
 */

import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET as string

// Hashes a user's password before storing it in the database (used during registration)
export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 12)
}

// Compares entered password with stored hash to validate login credentials
export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword)
}

// Generates a JWT token that stores the user's ID (used after successful login)
export function generateToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

// Verifies a JWT token and returns the user's ID if valid, otherwise returns null
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}

// Retrieves the auth token from cookies and returns the user ID if authenticated
export async function getAuthUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value
  if (!token) return null

  const decoded = verifyToken(token)
  return decoded?.userId || null
}

// Sets a secure HTTP-only cookie to persist user login (called after login/register)
export async function createAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

// Clears the auth cookie to log the user out
export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}
