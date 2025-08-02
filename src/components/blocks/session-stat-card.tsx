import { Card, CardContent } from "@/components/ui/card"

interface SessionStatCardProps {
  title: string
  count: number
}

export function SessionStatCard({ title, count }: SessionStatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{count}</p>
      </CardContent>
    </Card>
  )
}
