'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { completeReview } from '@/lib/actions/reviews'

type Props = {
  reviewId: string
  existingFeedback: string | null
}

export default function ReviewerActionsBar({ reviewId, existingFeedback }: Props) {
  const router = useRouter()
  const [feedback, setFeedback] = useState(existingFeedback ?? '')
  const [showSummaryForm, setShowSummaryForm] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleComplete() {
    if (!feedback.trim()) {
      setError('Please write an overall summary before completing the review.')
      setShowSummaryForm(true)
      return
    }
    setCompleting(true)
    setError(null)
    const { error } = await completeReview(reviewId, feedback)
    if (error) {
      setError(error)
      setCompleting(false)
      return
    }
    router.refresh()
  }

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="max-w-4xl mx-auto">

        {/* Summary section — toggle open/closed */}
        {showSummaryForm && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Overall Summary
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
              placeholder="Write your overall feedback for the student here..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        {error && (
          <p className="mb-3 text-sm text-red-500">{error}</p>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSummaryForm((v) => !v)}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {showSummaryForm ? 'Hide Summary' : 'Write Overall Summary'}
          </button>
          <button
            onClick={handleComplete}
            disabled={completing}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {completing ? 'Completing...' : 'Complete Review'}
          </button>
        </div>
      </div>
    </div>
  )
}