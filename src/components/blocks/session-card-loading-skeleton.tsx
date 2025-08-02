import React from "react"

type SessionCardLoadingSkeletonProps = {
  count?: number
}

export default function SessionCardLoadingSkeleton({
  count = 4,
}: SessionCardLoadingSkeletonProps) {
  return (
      <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-gray-200 p-4 shadow-sm animate-pulse bg-white"
        >
          <div className="mb-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="mb-4">
            <div className="h-3 bg-gray-200 rounded w-full mb-2" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
          <div className="h-8 bg-gray-200 rounded w-full" />
        </div>
      ))}
      </>
  )
}
