/**
 * A client-side popup for cookie consent.
 * Shown only if the user hasn't accepted or declined cookies yet.
 * Uses localStorage to remember the user's choice across sessions.
 * Enhances user experience while supporting privacy best practices.
 */
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Cookie } from "lucide-react"

export function CookiesPopup() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const cookiesAccepted = localStorage.getItem("cookies-accepted")
    if (!cookiesAccepted) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookies-accepted", "true")
    setIsVisible(false)
  }

  const declineCookies = () => {
    localStorage.setItem("cookies-accepted", "false")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <Card className="bg-white/95 backdrop-blur-sm border shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Cookie className="h-5 w-5 text-amber-600 mt-0.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 mb-3">
                We use cookies to enhance your experience and analyze site usage. By continuing, you agree to our use of
                cookies.
              </p>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={acceptCookies}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1"
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={declineCookies}
                  className="text-xs px-3 py-1 bg-transparent"
                >
                  Decline
                </Button>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)} className="flex-shrink-0 h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
