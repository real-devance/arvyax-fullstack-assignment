import { BookOpen } from "lucide-react"
import Link from "next/link"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center space-x-3 ${className}`}>
      <BookOpen className="h-8 w-8 text-blue-600" />
      <p className="font-bold text-2xl">
        Wellness Platform
      </p>
    </Link>
  )
}
