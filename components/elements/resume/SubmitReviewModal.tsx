'use client'

import { useState } from 'react'
import { Loader2 } from "lucide-react";

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { uploadCurrentBuilderResume } from '@/lib/resume/uploadResume'
import { ResumeUploader } from './ResumeUploader'

type Props = {
  onClose: () => void
  onSubmitted: () => void
  preSelectedVersionId?: string
  mode?: 'upload' | 'builder'
  builderLabel?: string
  builderFileName?: string
}

export function SubmitReviewModal({
  onClose,
  onSubmitted,
  preSelectedVersionId,
  mode = 'upload',
  builderLabel,
  builderFileName = 'Resume.pdf',
}: Props) {
  const supabase = createClient()
  const [versionId, setVersionId] = useState<string | null>(preSelectedVersionId ?? null)
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const isBuilderMode = mode === 'builder'

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setError('Not authenticated')
      setSubmitting(false)
      return
    }

    let resolvedVersionId = versionId

    if (isBuilderMode && !resolvedVersionId) {
      try {
        const uploadResult = await uploadCurrentBuilderResume(
          builderFileName,
          builderLabel,
        )
        resolvedVersionId = uploadResult.versionId
        setVersionId(uploadResult.versionId)
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : 'Failed to generate and upload resume PDF')
        setSubmitting(false)
        return
      }
    }

    if (!resolvedVersionId) {
      setError('Please upload a PDF before submitting for review.')
      setSubmitting(false)
      return
    }

    const { error: submitError } = await supabase
      .from('review_requests')
      .insert({
        student_id: session.user.id,
        resume_version_id: resolvedVersionId,
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
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[92vw] max-w-xl rounded-3xl border-2 border-dashed border-[#2d313a] bg-[#1c1d21] p-0 text-white shadow-[0_25px_60px_rgba(3,4,7,0.55)]">
        <div className="rounded-3xl border border-white/5 bg-[radial-gradient(circle_at_top,_rgba(39,76,188,0.16),_transparent_55%),linear-gradient(180deg,_rgba(21,23,28,0.96),_rgba(13,14,18,0.96))] p-6">
          <DialogHeader className="text-left">
            <span className="inline-flex w-fit items-center rounded-full border border-[#2b3242] bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#89a5ff]">
              Resume review
            </span>
            <DialogTitle className="mt-4 text-2xl font-semibold text-white">
              Submit Resume for Review
            </DialogTitle>
            <DialogDescription className="text-sm text-[#6d7895]">
              {isBuilderMode
                ? 'Submit the current builder PDF, set the urgency, and add any context that will help the reviewer focus their feedback.'
                : 'Upload the PDF you want reviewed, set the urgency, and add any context that will help the reviewer focus their feedback.'}
            </DialogDescription>
          </DialogHeader>

          {!preSelectedVersionId && !isBuilderMode && (
            <div className="mt-6 space-y-2">
              <Label className="text-[#cfd3e1]">Upload Resume PDF</Label>
              <ResumeUploader
                onUploadComplete={(id) => setVersionId(id)}
              />
            </div>
          )}

          {(preSelectedVersionId || isBuilderMode) && (
            <div className="mt-6 rounded-2xl border border-dashed border-[#274cbc]/40 bg-[#274cbc]/10 p-4 text-sm text-[#cfd3e1]">
              {isBuilderMode
                ? 'We will generate and upload the current builder PDF when you confirm this review request.'
                : 'Using your current builder resume for this review request.'}
            </div>
          )}

          <div className="mt-6 space-y-2">
            <Label htmlFor="review-priority" className="text-[#cfd3e1]">
              Priority
            </Label>
            <select
              id="review-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as typeof priority)}
              className="h-11 w-full rounded-xl border border-dashed border-[#3d4353] bg-[#1a1d24] px-3 text-sm text-white outline-none transition focus:border-[#274cbc]"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="mt-6 space-y-2">
            <Label htmlFor="review-notes" className="text-[#cfd3e1]">
              Notes for reviewer <span className="text-[#6d7895]">(optional)</span>
            </Label>
            <textarea
              id="review-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Applying for SWE internships, please focus on my projects and skills sections."
              className="h-28 w-full resize-none rounded-2xl border border-dashed border-[#3d4353] bg-[#1a1d24] px-4 py-3 text-sm text-white placeholder:text-[#6d7895] outline-none transition focus:border-[#274cbc]"
            />
          </div>

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={onClose}
              variant="outline"
              className="h-11 flex-1 rounded-xl border-dashed border-[#2f323a] bg-transparent text-[#cfd3e1] hover:border-[#4b4f5c] hover:bg-[#161920] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || (!isBuilderMode && !versionId)}
              className="h-11 flex-1 rounded-xl bg-[#274cbc] text-sm font-semibold text-white hover:bg-[#315be1]"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isBuilderMode ? 'Preparing PDF...' : 'Submitting...'}
                </>
              ) : 'Submit for Review'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
