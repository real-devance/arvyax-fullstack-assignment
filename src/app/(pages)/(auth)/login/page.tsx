"use client"

/**
 * LoginPage.tsx
 *
 * This component renders the login screen of the application.
 * It fulfills the "Login / Register" interface requirement of the
 * Arvyax Full Stack Internship Assignment.
 *
 * Features:
 * - Styled login form using a reusable <LoginForm /> component
 * - Responsive card layout with centered positioning
 * - Includes branding via <Logo />
 * - Link to registration page for new users
 */

import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle} from "@/components/ui/card"
import { LoginForm } from "@/components/forms/login-form"
import { Logo } from "@/components/common/logo"
import Link from "next/link"

// Renders the login page with branding and form
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        {/* App logo at the top */}
        <div className="mb-8">
          <Logo className="justify-center" />
        </div>

        {/* Login form inside a styled card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <LoginForm />
          </CardContent>

          {/* Link to registration page */}
          <CardFooter className="mx-auto">
            <p className="text-sm text-center text-gray-600">
              {"Don't have an account? "}
              <Link href="/register" className="text-indigo-600 hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
