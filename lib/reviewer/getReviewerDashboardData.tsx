
import { createClient } from '@/lib/supabase/server'

export type ReviewRequestWithVersion = {
    id: string
    status: string
    priority: string
    student_notes: string | null
    created_at: string
    claimed_at: string | null
    student_id: string
    resume_versions: {
        label: string | null
        file_name: string | null
        created_at: string
    }[] | null
    user_profiles: {
        full_name: string | null
        email: string
    }[] | null
}

export async function getReviewerDashboardData(reviewerId: string) {
    const supabase = await createClient()
    const { data: pendingRequests, error: pendingError } = await supabase
        .from('review_requests')
        .select(`
    id, status, priority, student_notes, created_at, claimed_at, student_id,
    resume_versions ( label, file_name, created_at )
  `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

    const { data: activeReviews, error: activeError } = await supabase
        .from('review_requests')
        .select(`
    id, status, priority, student_notes, created_at, claimed_at, student_id,
    resume_versions ( label, file_name, created_at )
  `)
        .eq('status', 'accepted')
        .eq('reviewer_id', reviewerId)
        .order('claimed_at', { ascending: false })


    if (pendingError) {
        console.error('[getReviewerDashboardData] pendingError:', pendingError)
    }
    if (activeError) {
        console.error('[getReviewerDashboardData] activeError:', activeError)
    }

    // Collect all unique student IDs from both result sets
    const allRequests = [...(pendingRequests ?? []), ...(activeReviews ?? [])]
    const studentIds = [...new Set(allRequests.map(r => r.student_id))]

    // Single query to get all relevant profiles
    const { data: profiles } = await supabase
        .from('user_profiles')
        .select('id, full_name, email')
        .in('id', studentIds)

    // Build a lookup map for easy access in the component
    const profileMap = Object.fromEntries(
        (profiles ?? []).map(p => [p.id, p])
    )

    return {
        pendingRequests: (pendingRequests ?? []).map(r => ({
            ...r,
            user_profiles: profileMap[r.student_id] ?? null,
        })),
        activeReviews: (activeReviews ?? []).map(r => ({
            ...r,
            user_profiles: profileMap[r.student_id] ?? null,
        })),
        errors: { pendingError, activeError },
    }
}