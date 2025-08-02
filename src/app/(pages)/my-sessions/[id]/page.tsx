"use client"

/**
 * SessionEditorPage.tsx
 *
 * This page allows authenticated users to create or edit a wellness session.
 * It fulfills the "Create/Edit Session" requirement of the Arvyax Full Stack Internship Assignment.
 *
 * Key Features:
 * - Form with fields for title, tags, and JSON file URL
 * - Auto-save draft functionality with 5s debounce
 * - Manual "Save Draft" and "Publish" buttons
 * - Protects already published sessions from further edits
 */

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { SessionHeader } from "@/components/blocks/session-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Save, Send, Loader2, ArrowLeft } from "lucide-react"
import { SessionEditorLoadingSkeleton } from "@/components/blocks/session-editor-loading-skeleton"
import { SessionEditorCard } from "@/components/blocks/session-editor-card"
import type { Session } from "@/types/session"

export default function SessionEditorPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState("")
  const [jsonFileUrl, setJsonFileUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null)

  const router = useRouter()
  const params = useParams()
  const sessionId = params.id as string
  const isNewSession = sessionId === "new"

  /**
   * Fetch session details if editing an existing session.
   * Prevents editing if session is already published.
   */
  const fetchSession = useCallback(async () => {
    try {
      const response = await fetch(`/api/my-sessions/${sessionId}`)
      const data = await response.json()

      if (response.ok) {
        const sessionData = data.session

        if (sessionData.status === "published") {
          toast.error("Published sessions cannot be edited")
          router.push("/my-sessions")
          return
        }

        setSession(sessionData)
        setTitle(sessionData.title)
        setTags(sessionData.tags?.join(", ") || "")
        setJsonFileUrl(sessionData.json_file_url)
      } else {
        toast.error("Failed to load session")
        router.push("/my-sessions")
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
      router.push("/my-sessions")
    } finally {
      setIsLoading(false)
    }
  }, [sessionId, router])

  // Load session data on mount (if not new)
  useEffect(() => {
    if (!isNewSession) {
      fetchSession()
    } else {
      setIsLoading(false)
    }
  }, [isNewSession, fetchSession])

  /**
   * Save session as draft
   */
  const saveDraft = useCallback(
    async (showToast = false) => {
      if (!title.trim() || !jsonFileUrl.trim()) {
        if (showToast) toast.error("Title and JSON file URL are required")
        return
      }

      setIsSaving(true)
      try {
        const response = await fetch("/api/my-sessions/save-draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: isNewSession ? null : sessionId,
            title,
            tags,
            json_file_url: jsonFileUrl,
          }),
        })

        const data = await response.json()

        if (response.ok) {
          setLastSaved(new Date())
          if (showToast) toast.success("Draft saved successfully")

          if (isNewSession && data.session._id) {
            window.history.replaceState(null, "", `/my-sessions/${data.session._id}`)
            setSession(data.session)
          }
        } else {
          if (data.error === "Cannot modify published sessions") {
            toast.error("This session has been published and cannot be edited")
            router.push("/my-sessions")
            return
          }
          if (showToast) toast.error("Failed to save draft")
        }
      } catch (error) {
        console.error(error)
        if (showToast) toast.error("Something went wrong")
      } finally {
        setIsSaving(false)
      }
    },
    [title, tags, jsonFileUrl, sessionId, isNewSession, router]
  )

  /**
   * Auto-save with debounce (5s)
   */
  useEffect(() => {
    if (autoSaveTimeout) clearTimeout(autoSaveTimeout)

    if (title.trim() && jsonFileUrl.trim()) {
      const timeout = setTimeout(() => {
        saveDraft(false)
      }, 5000)
      setAutoSaveTimeout(timeout)
    }

    return () => {
      if (autoSaveTimeout) clearTimeout(autoSaveTimeout)
    }
  }, [title, tags, jsonFileUrl, saveDraft])

  /**
   * Publish the session
   */
  const handlePublish = async () => {
    if (!title.trim() || !jsonFileUrl.trim()) {
      toast.error("Title and JSON file URL are required")
      return
    }

    setIsPublishing(true)
    try {
      const response = await fetch("/api/my-sessions/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: isNewSession ? null : sessionId,
          title,
          tags,
          json_file_url: jsonFileUrl,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Session published successfully")
        router.push("/my-sessions")
      } else {
        if (data.error === "Cannot modify published sessions") {
          toast.error("This session has already been published")
          router.push("/my-sessions")
          return
        }
        toast.error("Failed to publish session")
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    } finally {
      setIsPublishing(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SessionHeader />
        <SessionEditorLoadingSkeleton />
      </div>
    )
  }

  // Main editor layout
  return (
    <div className="min-h-screen bg-gray-50">
      <SessionHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Section */}
        <div className="md:flex items-center justify-between mb-8">
          {/* Back + Title */}
          <div className="flex items-center space-x-4">
            <Link href="/my-sessions">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sessions
              </Button>
            </Link>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {isNewSession ? "Create New Session" : "Edit Session"}
              </h1>

              {session && (
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={session.status === "published" ? "default" : "secondary"}>
                    {session.status}
                  </Badge>
                  {lastSaved && (
                    <span className="text-sm text-gray-500">
                      Last saved: {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-5 flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => saveDraft(true)}
              disabled={isSaving || !title.trim() || !jsonFileUrl.trim()}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>

            <Button
              onClick={handlePublish}
              disabled={isPublishing || !title.trim() || !jsonFileUrl.trim()}
            >
              {isPublishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Send className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        {/* Editor Form Fields */}
        <SessionEditorCard
          title={title}
          setTitle={setTitle}
          tags={tags}
          setTags={setTags}
          jsonFileUrl={jsonFileUrl}
          setJsonFileUrl={setJsonFileUrl}
        />
      </div>
    </div>
  )
}
