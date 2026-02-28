type Props = {
  priority: string
  studentNotes: string | null
  resumeLabel: string | null
  fileName: string | null
  submittedAt: string
  claimedAt: string | null
  completedAt: string | null
  reviewerFeedback: string | null
  viewerRole: 'student' | 'reviewer' | 'admin'
}

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  normal: 'bg-blue-100 text-blue-700',
  high: 'bg-red-100 text-red-700',
}

export default function ReviewMetadata({
  priority,
  studentNotes,
  resumeLabel,
  fileName,
  submittedAt,
  claimedAt,
  completedAt,
  reviewerFeedback,
  viewerRole,
}: Props) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      {/* Resume info */}
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Resume</p>
        <p className="text-sm text-gray-900 mt-0.5">{resumeLabel ?? fileName ?? 'Untitled'}</p>
      </div>

      {/* Priority */}
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Priority</p>
        <span className={`inline-block mt-0.5 text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[priority] ?? priorityColors.normal}`}>
          {priority}
        </span>
      </div>

      {/* Timeline */}
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Timeline</p>
        <ul className="mt-1 space-y-0.5 text-sm text-gray-600">
          <li>Submitted: {new Date(submittedAt).toLocaleString()}</li>
          {claimedAt && <li>Claimed: {new Date(claimedAt).toLocaleString()}</li>}
          {completedAt && <li>Completed: {new Date(completedAt).toLocaleString()}</li>}
        </ul>
      </div>

      {/* Student notes — visible to both roles */}
      {studentNotes && (
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Student Notes</p>
          <p className="mt-0.5 text-sm text-gray-700 whitespace-pre-wrap">{studentNotes}</p>
        </div>
      )}

      {/* Reviewer feedback — visible to student only after completion */}
      {viewerRole === 'student' && reviewerFeedback && (
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Reviewer Feedback</p>
          <p className="mt-0.5 text-sm text-gray-700 whitespace-pre-wrap">{reviewerFeedback}</p>
        </div>
      )}
    </div>
  )
}