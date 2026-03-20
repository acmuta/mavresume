// src/lib/actions/annotations.ts
'use server'

import { createClient } from '@/lib/supabase/server'

// Create a new annotation
export async function createAnnotation(payload: {
  reviewId: string
  type: 'text' | 'area'
  pageNumber: number
  position: object
  comment: string
}): Promise<{ id: string | null; error: string | null }> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (!user || authError) return { id: null, error: 'Unauthenticated' }

  const { data, error } = await supabase
    .from('annotations')
    .insert({
      review_id: payload.reviewId,
      reviewer_id: user.id,
      type: payload.type,
      page_number: payload.pageNumber,
      position: payload.position,
      comment: payload.comment,
    })
    .select('id')
    .single()

  if (error) return { id: null, error: error.message }
  return { id: data.id, error: null }
}

// Update an annotation's comment
export async function updateAnnotation(
  annotationId: string,
  comment: string
): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (!user || authError) return { error: 'Unauthenticated' }

  const { error } = await supabase
    .from('annotations')
    .update({ comment })
    .eq('id', annotationId)
    .eq('reviewer_id', user.id)

  if (error) return { error: error.message }
  return { error: null }
}

// Delete an annotation
export async function deleteAnnotation(
  annotationId: string
): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (!user || authError) return { error: 'Unauthenticated' }

  const { error } = await supabase
    .from('annotations')
    .delete()
    .eq('id', annotationId)
    .eq('reviewer_id', user.id)

  if (error) return { error: error.message }
  return { error: null }
}

// Load all annotations for a review
export async function getAnnotationsForReview(reviewId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('annotations')
    .select('*')
    .eq('review_id', reviewId)
    .order('created_at', { ascending: true })

  if (error) return []
  return data
}