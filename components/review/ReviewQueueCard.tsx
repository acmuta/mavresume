// src/components/review/ReviewQueueCard.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { claimReview } from '@/lib/actions/reviews'
import type { ReviewRequestWithVersion } from '@/lib/reviewer/getReviewerDashboardData'

type Props = {
  review: ReviewRequestWithVersion
  mode: 'pending' | 'active'
}

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  normal: 'bg-blue-100 text-blue-700',
  high: 'bg-red-100 text-red-700',
}

export default function ReviewQueueCard({ review, mode }: Props) {
  const router = useRouter()
  const [claiming, setClaiming] = useState(false)
  const [claimed, setClaimed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handle both object (PostgREST many-to-one) and array shapes
  const profile = Array.isArray(review.user_profiles)
    ? review.user_profiles[0]
    : review.user_profiles
  const version = Array.isArray(review.resume_versions)
    ? review.resume_versions[0]
    : review.resume_versions
  const studentName = profile?.full_name ?? profile?.email ?? 'Unknown student'
  const resumeLabel = version?.label ?? version?.file_name ?? 'Untitled resume'
  const submittedDate = new Date(review.created_at).toLocaleDateString()
  const claimedDate = review.claimed_at ? new Date(review.claimed_at).toLocaleDateString() : null

  async function handleAccept() {
    setClaiming(true)
    setError(null)
    const { error } = await claimReview(review.id)
    if (error) {
      setError(error)
      setClaiming(false)
      return
    }
    // Show "Start Review" button without a page reload
    setClaimed(true)
    setClaiming(false)
  }

  function handleStartReview() {
    router.push(`/review/${review.id}`)
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4">
        {/* Left: metadata */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{studentName}</p>
          <p className="text-sm text-gray-500 truncate">{resumeLabel}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[review.priority] ?? priorityColors.normal}`}>
              {review.priority}
            </span>
            <span className="text-xs text-gray-400">
              Submitted {submittedDate}
            </span>
            {claimedDate && (
              <span className="text-xs text-gray-400">
                Claimed {claimedDate}
              </span>
            )}
          </div>
          {review.student_notes && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {review.student_notes}
            </p>
          )}
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </div>

        {/* Right: action button */}
        <div className="shrink-0">
          {mode === 'pending' && !claimed && (
            <button
              onClick={handleAccept}
              disabled={claiming}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {claiming ? 'Accepting...' : 'Accept'}
            </button>
          )}
          {(mode === 'active' || claimed) && (
            <button
              onClick={handleStartReview}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Start Review
            </button>
          )}
        </div>
      </div>
    </div>
  )
}