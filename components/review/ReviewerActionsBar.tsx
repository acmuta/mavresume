'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, MessageSquareText } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { completeReview } from '@/lib/actions/reviews'

type Props = {
  reviewId: string
  existingFeedback: string | null
}

export default function ReviewerActionsBar({ reviewId, existingFeedback }: Props) {
  const router = useRouter()
  const [feedback, setFeedback] = useState(existingFeedback ?? '')
  const [showSummaryForm, setShowSummaryForm] = useState(Boolean(existingFeedback))
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
    <section className="rounded-2xl border-2 border-dashed border-[#2d313a] bg-[#15171c]/80 p-6 shadow-[0_20px_60px_rgba(9,10,12,0.35)] backdrop-blur-md">
      <div className="mb-5 flex items-center gap-2">
        <CheckCircle2 className="size-5 text-[#58f5c3]" />
        <div>
          <h2 className="text-xl font-semibold text-white">Complete Review</h2>
          <p className="mt-1 text-sm text-[#6d7895]">
            Add an overall summary before marking the review as finished.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-[#2d313a] bg-[#111219]/80 p-4">
        <div className="flex items-center gap-2 text-[#89a5ff]">
          <MessageSquareText className="size-4" />
          <p className="text-xs font-medium uppercase tracking-[0.2em]">
            Reviewer summary
          </p>
        </div>

        {showSummaryForm && (
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-[#cfd3e1]">
              Overall Summary
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
              placeholder="Write your overall feedback for the student here..."
              className="w-full rounded-2xl border border-dashed border-[#3d4353] bg-[#1a1d24] px-4 py-3 text-sm text-white placeholder:text-[#6d7895] outline-none transition focus:border-[#274cbc]"
            />
          </div>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-400">{error}</p>
        )}

        <div className="mt-4 flex flex-col gap-3">
          <Button
            onClick={() => setShowSummaryForm((value) => !value)}
            variant="outline"
            className="h-11 w-full rounded-xl border-dashed border-[#2f323a] bg-transparent text-sm text-[#cfd3e1] hover:border-[#4b4f5c] hover:bg-[#161920] hover:text-white"
          >
            {showSummaryForm ? 'Hide Summary' : 'Write Overall Summary'}
          </Button>
          <Button
            onClick={handleComplete}
            disabled={completing}
            className="h-11 w-full rounded-xl bg-[#274cbc] text-sm font-semibold text-white hover:bg-[#315be1]"
          >
            {completing ? 'Completing...' : 'Complete Review'}
          </Button>
        </div>
      </div>
    </section>
  )
}
