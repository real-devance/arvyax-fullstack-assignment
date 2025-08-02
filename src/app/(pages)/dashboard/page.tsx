"use client"

/**
 * DashboardPage.tsx
 *
 * This page displays all published wellness sessions and supports interactive filtering by tags.
 * It fulfills the "Dashboard View" requirement of the Arvyax Full Stack Internship Assignment.
 *
 * Key Features:
 * - Fetches published sessions from the backend (`/api/sessions`)
 * - Displays sessions in a grid layout using <SessionCard />
 * - Provides tag-based filtering (multi-select)
 * - Includes loading states and empty state handling
 * - Uses client-side filtering (no search query sent to backend)
 */

import { useState, useEffect } from "react"
import { SessionHeader } from "@/components/blocks/session-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { BookOpen, Tag, X } from "lucide-react"
import SessionCard from "@/components/blocks/session-card"
import SessionCardLoadingSkeleton from "@/components/blocks/session-card-loading-skeleton"
import type { Session } from "@/types/session"

export default function DashboardPage() {
  // State for sessions, filtered sessions, tags, and loading
  const [sessions, setSessions] = useState<Session[]>([])
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])

  // Fetch published sessions from the backend on mount
  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/sessions")
      const data = await response.json()

      if (response.ok) {
        setSessions(data.sessions)

        // Extract and sort unique tags
        const tags = new Set<string>()
        data.sessions.forEach((session: Session) => {
          session.tags?.forEach((tag) => tags.add(tag))
        })
        setAllTags(Array.from(tags).sort())
      } else {
        toast.error("Failed to fetch sessions")
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  // Filter sessions by tags and searchTerm on any dependency change
  useEffect(() => {
    const filterSessions = () => {
      let filtered = sessions

      if (searchTerm) {
        filtered = filtered.filter(
          (session) =>
            session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
        )
      }

      if (selectedTags.length > 0) {
        filtered = filtered.filter((session) =>
          selectedTags.some((selectedTag) => session.tags?.includes(selectedTag)),
        )
      }

      setFilteredSessions(filtered)
    }

    filterSessions()
  }, [sessions, searchTerm, selectedTags])

  // Toggle selected tag filter
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  // Reset filters and search
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTags([])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation bar with logo */}
      <SessionHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wellness Sessions</h1>
          <p className="text-gray-600">Discover and explore wellness sessions from our community</p>
        </div>

        {/* Tag-based filters */}
        <div className="mb-8 space-y-4">
          {allTags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  Filter by Tags
                </h3>
                {selectedTags.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Clear Filters
                  </Button>
                )}
              </div>

              {/* Tag buttons */}
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleTag(tag)}
                    className="text-xs cursor-pointer"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Show selected filters summary */}
          {selectedTags.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Active filters:</span>
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  Tag: {tag}
                </Badge>
              ))}
              <span className="text-gray-500">
                ({filteredSessions.length} of {sessions.length ?? 0} sessions)
              </span>
            </div>
          )}
        </div>

        {/* Display sessions or fallback states */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SessionCardLoadingSkeleton />
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {sessions.length === 0
                ? "No sessions yet"
                : "No sessions match your filters"}
            </h3>
            <p className="text-gray-600">
              {sessions.length === 0
                ? "Be the first to create and publish a wellness session!"
                : "Try adjusting your search terms or selected tags."}
            </p>
            {selectedTags.length > 0 && (
              <Button variant="outline" onClick={clearFilters} className="mt-4 bg-transparent">
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <SessionCard key={session._id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
