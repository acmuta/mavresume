import type { Highlight } from 'react-pdf-highlighter-extended'

export interface AnnotationRecord {
  id: string
  review_id: string
  reviewer_id: string
  type: 'text' | 'area'
  page_number: number
  position: object
  comment: string
  created_at: string
}

export interface AnnotationHighlight extends Highlight {
  comment: string
  annotationId: string
  type: 'text' | 'area'
}