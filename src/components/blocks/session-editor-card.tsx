"use client"

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tag, FileText } from "lucide-react"

type SessionEditorCardProps = {
  title: string
  setTitle: (val: string) => void
  tags: string
  setTags: (val: string) => void
  jsonFileUrl: string
  setJsonFileUrl: (val: string) => void
}

export function SessionEditorCard({
  title,
  setTitle,
  tags,
  setTags,
  jsonFileUrl,
  setJsonFileUrl,
}: SessionEditorCardProps) {
  const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Details</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Title Input */}
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="Enter session title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg"
          />
        </div>

        {/* Tags Input */}
        <div className="space-y-2">
          <Label htmlFor="tags" className="flex items-center space-x-2">
            <Tag className="h-4 w-4" />
            <span>Tags</span>
          </Label>
          <Input
            id="tags"
            placeholder="meditation, mindfulness, stress-relief"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <p className="text-sm text-gray-500">
            Separate tags with commas to help users discover your session.
          </p>
          {tagList.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tagList.map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* JSON File URL */}
        <div className="space-y-2">
          <Label htmlFor="jsonFileUrl" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>JSON File URL *</span>
          </Label>
          <Input
            id="jsonFileUrl"
            type="url"
            placeholder="https://example.com/path/to/your/session.json"
            value={jsonFileUrl}
            onChange={(e) => setJsonFileUrl(e.target.value)}
          />
          <p className="text-sm text-gray-500">
          Paste a direct link to your session&#39;s JSON file.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
