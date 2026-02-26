import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ResumeUploader } from './ResumeUploader'

type Props = {
  onClose: () => void
  onSubmitted: () => void
  // Pass a pre-selected versionId if coming from the builder
  preSelectedVersionId?: string
}

export function SubmitReviewModal({ onClose, onSubmitted, preSelectedVersionId }: Props) {
  const supabase = createClient()
  const [versionId, setVersionId] = useState<string | null>(preSelectedVersionId ?? null)
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!versionId) return
    setSubmitting(true)
    setError('')

    const { data: { session } } = await supabase.auth.getSession()

    const { error: submitError } = await supabase
      .from('review_requests')
      .insert({
        student_id: session!.user.id,
        resume_version_id: versionId,
        priority,
        student_notes: notes || null,
        status: 'pending',
      })

    if (submitError) {
      setError(submitError.message)
      setSubmitting(false)
      return
    }

    onSubmitted()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Submit Resume for Review</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        {/* Only show uploader if not coming from builder with a pre-selected version */}
        {!preSelectedVersionId && (
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Upload Resume PDF
            </label>
            <ResumeUploader
              onUploadComplete={(id) => setVersionId(id)}
            />
          </div>
        )}

        {preSelectedVersionId && (
          <p className="text-sm text-green-600 bg-green-50 rounded p-2 mb-4">
            ✓ Using your current builder resume
          </p>
        )}

        {/* Priority selector */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as typeof priority)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Notes for reviewer <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Applying for SWE internships, focus on my skills section"
            className="w-full border rounded-lg px-3 py-2 text-sm h-24 resize-none"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!versionId || submitting}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium
                       disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700"
          >
            {submitting ? 'Submitting...' : 'Submit for Review'}
          </button>
        </div>
      </div>
    </div>
  )
}