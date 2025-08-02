"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {  User, Home } from "lucide-react"
import { Logo } from "../common/logo"
import {LogoutForm} from "../forms/logout-form"

export function SessionHeader() {



  return (
    <nav className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
           <Logo/>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/my-sessions">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  My Sessions
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center">
          <LogoutForm />
          </div>
        </div>
      </div>
    </nav>
  )
}
