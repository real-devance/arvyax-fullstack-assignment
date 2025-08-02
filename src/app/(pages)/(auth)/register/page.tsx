"use client"

/**
 * RegisterPage.tsx
 *
 * This page provides a user interface for new users to register.
 * It fulfills the "Register" form requirement from the
 * Arvyax Full Stack Internship Assignment.
 *
 * Features:
 * - Clean form layout using the reusable <RegisterForm /> component
 * - Centered card with branding via <Logo />
 * - Link to the login page for existing users
 */

import Link from "next/link"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle} from "@/components/ui/card"
import { RegisterForm } from "@/components/forms/register-form"
import { Logo } from "@/components/common/logo"

// Renders the registration page with form and navigation to login
export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        {/* Logo displayed above the form */}
        <div className="text-center mb-8">
          <Logo className="justify-center" />
        </div>

        {/* Card containing the registration form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Join our wellness community today
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <RegisterForm />
          </CardContent>

          {/* Navigation to login for existing users */}
          <CardFooter className="mx-auto">
            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-600 hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
