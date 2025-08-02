import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "../common/logo"

export function Header() {
  return (
    <header className="w-full py-6">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
                <Logo/>

                <div className="flex items-center space-x-4">
                    <Link href="/login">
                        <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                        Sign In
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700
                         text-white shadow-lg hover:shadow-xl transition-all duration-300">
                        Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
  </header>
  )
}

