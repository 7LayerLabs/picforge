import React from 'react'

interface SkeletonLoaderProps {
  type?: 'image' | 'text' | 'button' | 'card'
  className?: string
  count?: number
}

export default function SkeletonLoader({ type = 'text', className = '', count = 1 }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'image':
        return (
          <div className={`skeleton rounded-xl bg-gray-200 dark:bg-gray-800 ${className}`}>
            <div className="w-full h-full" />
          </div>
        )
      case 'text':
        return (
          <div className={`skeleton h-4 rounded-md bg-gray-200 dark:bg-gray-800 ${className}`} />
        )
      case 'button':
        return (
          <div className={`skeleton h-10 w-24 rounded-lg bg-gray-200 dark:bg-gray-800 ${className}`} />
        )
      case 'card':
        return (
          <div className={`skeleton rounded-xl bg-gray-200 dark:bg-gray-800 p-4 ${className}`}>
            <div className="h-32 rounded-lg bg-gray-300 dark:bg-gray-700 mb-3 skeleton" />
            <div className="h-4 rounded bg-gray-300 dark:bg-gray-700 mb-2 skeleton" />
            <div className="h-4 rounded bg-gray-300 dark:bg-gray-700 w-3/4 skeleton" />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          {renderSkeleton()}
        </div>
      ))}
    </>
  )
}