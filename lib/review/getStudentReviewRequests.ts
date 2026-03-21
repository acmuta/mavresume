import { createClient } from '@/lib/supabase/client'

type ResumeVersionInfo = {
  label: string | null
  file_name: string | null
  created_at: string
}

export type StudentReviewRequest = {
  id: string
  status: string
  created_at: string
  priority: string
  student_notes: string | null
  /** Many-to-one FK: PostgREST returns object, not array */
  resume_versions: ResumeVersionInfo | ResumeVersionInfo[] | null
}

export async function getStudentReviewRequests(userId: string): Promise<StudentReviewRequest[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('review_requests')
    .select(`
      id, status, created_at, priority, student_notes,
      resume_versions ( label, file_name, created_at )
    `)
    .eq('student_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as StudentReviewRequest[]
}
