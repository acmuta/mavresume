// src/app/review/[id]/page.tsx
import { redirect, notFound } from 'next/navigation'
import { getUserWithSession, getUserRole } from '@/lib/auth/getUser'
import { getReviewDetail } from '@/lib/review/getReviewDetail'
import ReviewMetadata from '@/components/review/ReviewMetadata'
import ReviewerActionsBar from '@/components/review/ReviewerActionsBar'

type Props = {
  params: { id: string }
}

export default async function ReviewDetailPage({ params }: Props) {
  const auth = await getUserWithSession()
  if (!auth) redirect('/login?next=/review/' + params.id)
  const { user, session } = auth

  const review = await getReviewDetail(params.id)
  if (!review) notFound()

  const role = getUserRole(user, session) ?? 'student'

  // Access control:
  // - Students can only view their own reviews
  // - Reviewers/admins can view any review
  if (role === 'student' && review.student_id !== user.id) {
    redirect('/dashboard')
  }

  // Reviewers should only access reviews they have claimed (or admins)
  if (role === 'reviewer' && review.reviewer_id !== user.id) {
    redirect('/reviewer/dashboard')
  }

  const version = review.resume_versions?.[0]
  const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pending', color: 'text-yellow-600 bg-yellow-50' },
    accepted: { label: 'In Review', color: 'text-blue-600 bg-blue-50' },
    completed: { label: 'Completed', color: 'text-green-600 bg-green-50' },
  }
  const statusDisplay = statusLabels[review.status] ?? statusLabels.pending

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-3 flex items-center gap-3">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusDisplay.color}`}>
          {statusDisplay.label}
        </span>
        <h1 className="text-base font-semibold text-gray-900">
          Resume Review
        </h1>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 max-w-4xl mx-auto w-full">
        {/* 
          PDF viewer goes here in the next step.
          For now, show a placeholder so the layout is clear.
        */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center mb-6 bg-gray-50">
          <p className="text-gray-400 text-sm">PDF viewer will be added in the annotation step.</p>
          {version?.pdf_path && (
            <p className="text-gray-400 text-xs mt-1 font-mono">
              Path: {version.pdf_path}
            </p>
          )}
        </div>

        {/* Metadata panel */}
        <ReviewMetadata
          priority={review.priority}
          studentNotes={review.student_notes}
          resumeLabel={version?.label ?? null}
          fileName={version?.file_name ?? null}
          submittedAt={review.created_at}
          claimedAt={review.claimed_at}
          completedAt={review.completed_at}
          reviewerFeedback={review.reviewer_feedback}
          viewerRole={role}
        />
      </div>

      {/* Actions bar — only shown to reviewer/admin while review is active */}
      {(role === 'reviewer' || role === 'admin') && review.status === 'accepted' && (
        <div className="sticky bottom-0">
          <ReviewerActionsBar
            reviewId={review.id}
            existingFeedback={review.reviewer_feedback}
          />
        </div>
      )}
    </div>
  )
}