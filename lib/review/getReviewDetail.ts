import { createClient } from '@/lib/supabase/server'

export type ReviewDetail = {
  id: string
  status: string
  priority: string
  student_notes: string | null
  reviewer_feedback: string | null
  created_at: string
  claimed_at: string | null
  completed_at: string | null
  student_id: string
  reviewer_id: string | null
  resume_versions: {
    id: string
    label: string | null
    pdf_path: string | null
    file_name: string | null
    created_at: string
  } | null
}

export async function getReviewDetail(reviewId: string): Promise<ReviewDetail | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('review_requests')
    .select(`
      id, status, priority, student_notes, reviewer_feedback,
      created_at, claimed_at, completed_at, student_id, reviewer_id,
      resume_versions ( id, label, file_name, pdf_path, created_at )
    `)
    .eq('id', reviewId)
    .single()

  if (error || !data) return null
  return data as unknown as ReviewDetail
}