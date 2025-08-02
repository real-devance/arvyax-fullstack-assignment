"use client"

import {Card,CardContent, CardHeader,CardTitle} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {User,Calendar,Tag,ExternalLink} from "lucide-react"
import type { Session } from "@/types/session"
import { formatDate } from "@/lib/common/formatDate"

type SessionCardProps = {
    session: Session
}

export default function SessionCard({session}: SessionCardProps) {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">{session.title.slice(0,29)}</CardTitle>
                    <Badge variant="secondary">{session.status}</Badge>
                </div>
                
            </CardHeader>

            <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{session.user_id?.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(session.created_at)}</span>
                    </div>
                </div>

                {session.tags && session.tags.length > 0 && (
                    <div className="mb-4">
                        <div className="flex items-center space-x-1 mb-2">
                            <Tag className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">Tags</span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                            {session.tags.slice(0, 3).map((tag, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs hover:bg-gray-100"
                                >
                                    {tag}
                                </Badge>
                            ))}
                            {session.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{session.tags.length - 3} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                        onClick={() => window.open(session.json_file_url, "_blank")}
                    >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View JSON File
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
