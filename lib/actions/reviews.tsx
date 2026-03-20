"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getUserRole } from '@/lib/auth/getUser'

// Claim a pending review
// Called when a reviewer clicks "Accept" on the dashboard.
// Sets reviewer_id, status to 'accepted', and claimed_at.
export async function claimReview(reviewId: string): Promise<{ error: string | null }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthenticated' }

    // Update the review request
    const { error } = await supabase
        .from('review_requests')
        .update({
            reviewer_id: user.id,
            status: 'accepted',
            claimed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('id', reviewId)
        .eq('status', 'pending') // Guard: only claim if still pending

    if (error) return { error: error.message }

    revalidatePath('/reviewer/dashboard')
    return { error: null }
}

// Complete a review
// Called when a reviewer clicks "Complete Review" on /review/[id].
// Sets status → 'completed', completed_at, and saves reviewer_feedback.
export async function completeReview(
    reviewId: string,
    reviewerFeedback: string
): Promise<{ error: string | null }> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthenticated' }

    const { data: { session } } = await supabase.auth.getSession()
    const role = getUserRole(user, session)
    if (role !== 'reviewer' && role !== 'admin') return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('review_requests')
        .update({
            status: 'completed',
            reviewer_feedback: reviewerFeedback,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('id', reviewId)
        .eq('reviewer_id', user.id) // Guard: only the assigned reviewer can complete
        .eq('status', 'accepted')           // Guard: only complete an accepted review

    if (error) return { error: error.message }

    revalidatePath(`/review/${reviewId}`)
    revalidatePath('/reviewer/dashboard')
    revalidatePath('/dashboard')
    return { error: null }
}