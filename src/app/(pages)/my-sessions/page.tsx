"use client"

/**
 * MySessionsPage.tsx
 *
 * This page allows authenticated users to view and manage their own wellness sessions.
 * It fulfills the "My Sessions" requirement of the Arvyax Full Stack Internship Assignment.
 *
 * Features:
 * - Fetches user-specific sessions from `/api/my-sessions`
 * - Displays sessions in draft and published state
 * - Allows filtering by session status (All, Drafts, Published)
 * - Includes a button to create a new session
 * - Shows loading skeletons while fetching
 * - Handles empty states with contextual messages
 */

import { useState, useEffect } from "react"
import Link from "next/link"
import { SessionHeader } from "@/components/blocks/session-header"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Filter } from "lucide-react"
import { SessionEditCard } from "@/components/blocks/session-edit-card"
import { toast } from "sonner"
import type { Session } from "@/types/session"
import SessionCardLoadingSkeleton from "@/components/blocks/session-card-loading-skeleton"

export default function MySessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "published">("all")

  // Fetch sessions created by the authenticated user
  useEffect(() => {
    const fetchMySessions = async () => {
      try {
        const response = await fetch("/api/my-sessions")
        const data = await response.json()

        if (response.ok) {
          setSessions(data.sessions)
        } else {
          toast.error("Failed to fetch your sessions")
        }
      } catch (error) {
        toast.error("Something went wrong")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMySessions()
  }, [])

  // Filter counts
  const draftCount = sessions.filter((s) => s.status === "draft").length
  const publishedCount = sessions.filter((s) => s.status === "published").length

  // Apply selected filter
  const filteredSessions = sessions.filter((s) => {
    if (filterStatus === "all") return true
    return s.status === filterStatus
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <SessionHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title and Create Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">My Sessions</h1>
            <p className="text-gray-600">Manage your wellness sessions and drafts</p>
          </div>
          <Link href="/my-sessions/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Session
            </Button>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-8">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            onClick={() => setFilterStatus("all")}
          >
            All Sessions ({sessions.length})
          </Button>
          <Button
            variant={filterStatus === "draft" ? "default" : "outline"}
            onClick={() => setFilterStatus("draft")}
          >
            <Filter className="h-4 w-4 mr-2" />
            Drafts ({draftCount})
          </Button>
          <Button
            variant={filterStatus === "published" ? "default" : "outline"}
            onClick={() => setFilterStatus("published")}
          >
            Published ({publishedCount})
          </Button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SessionCardLoadingSkeleton />
          </div>
        ) : filteredSessions.length === 0 ? (
          // Empty State
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filterStatus === "all"
                ? "No sessions yet"
                : filterStatus === "draft"
                ? "No draft sessions"
                : "No published sessions"}
            </h3>
            <p className="text-gray-600 mb-6">
              {filterStatus === "all"
                ? "Create your first wellness session to get started."
                : filterStatus === "draft"
                ? "You haven't saved any draft sessions yet."
                : "You haven't published any sessions yet."}
            </p>
            <Link href="/my-sessions/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Session
              </Button>
            </Link>
          </div>
        ) : (
          // Session Cards
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <SessionEditCard key={session._id} session={session} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
