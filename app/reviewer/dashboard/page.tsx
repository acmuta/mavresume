// src/app/reviewer/dashboard/page.tsx
import { requireRole } from "@/lib/auth/getUser";
import { getReviewerDashboardData } from '@/lib/reviewer/getReviewerDashboardData'
import ReviewQueueCard from '@/components/review/ReviewQueueCard'

export default async function ReviewerDashboardPage() {
  const user = await requireRole('reviewer', 'admin')
  const { pendingRequests, activeReviews } = await getReviewerDashboardData(user.id)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Reviewer Dashboard</h1>

      {/* ── My Active Reviews ───────────────────────── */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">
          My Active Reviews
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({activeReviews.length})
          </span>
        </h2>
        {activeReviews.length === 0 ? (
          <p className="text-gray-500 text-sm">You have no active reviews.</p>
        ) : (
          <div className="space-y-4">
            {activeReviews.map((review) => (
              <ReviewQueueCard
                key={review.id}
                review={review}
                mode="active"
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Pending Queue ───────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold mb-4">
          Pending Requests
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({pendingRequests.length})
          </span>
        </h2>
        {pendingRequests.length === 0 ? (
          <p className="text-gray-500 text-sm">No pending requests at this time.</p>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((review) => (
              <ReviewQueueCard
                key={review.id}
                review={review}
                mode="pending"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}