// src/components/review/HighlightContainer.tsx
'use client'

import { useState } from 'react'
import {
  useHighlightContainerContext,
  usePdfHighlighterContext,
  MonitoredHighlightContainer,
  TextHighlight,
  AreaHighlight,
} from 'react-pdf-highlighter-extended'
import type { AnnotationHighlight } from '@/types/annotations'
import { updateAnnotation, deleteAnnotation } from '@/lib/actions/annotations'

type Props = {
  onEdit: (annotationId: string, newComment: string) => void
  onDelete: (annotationId: string) => void
  isReadOnly?: boolean
}

function AnnotationPopup({
  highlight,
  onEdit,
  onDelete,
  isReadOnly,
}: {
  highlight: AnnotationHighlight
  onEdit: (annotationId: string, newComment: string) => void
  onDelete: (annotationId: string) => void
  isReadOnly?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [editComment, setEditComment] = useState(highlight.comment)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleSaveEdit() {
    if (!editComment.trim()) return
    setSaving(true)
    const { error } = await updateAnnotation(highlight.annotationId, editComment.trim())
    setSaving(false)
    if (!error) {
      onEdit(highlight.annotationId, editComment.trim())
      setEditing(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    const { error } = await deleteAnnotation(highlight.annotationId)
    if (!error) onDelete(highlight.annotationId)
    setDeleting(false)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-64 text-sm">
      {editing ? (
        <>
          <textarea
            autoFocus
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded px-2 py-1 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => { setEditing(false); setEditComment(highlight.comment) }}
              className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={saving || !editComment.trim()}
              className="text-xs px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-800 whitespace-pre-wrap">{highlight.comment}</p>
          {!isReadOnly && (
            <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-indigo-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-xs text-red-500 hover:underline disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function HighlightContainer({ onEdit, onDelete, isReadOnly = false }: Props) {
  const {
    highlight,
    isScrolledTo,
    highlightBindings,
    viewportToScaled,
    screenshot,
  } = useHighlightContainerContext<AnnotationHighlight>()

  const { toggleEditInProgress } = usePdfHighlighterContext()

  const isAreaHighlight = Boolean(highlight.content?.image)

  const renderedHighlight = isAreaHighlight ? (
    <AreaHighlight
      isScrolledTo={isScrolledTo}
      highlight={highlight}
      onChange={(boundingRect) => {
        // Fires when a reviewer resizes an area highlight box.
        // We treat this as a position-only update; comment stays the same.
        const updatedPosition = {
          boundingRect: viewportToScaled(boundingRect),
          rects: [],
        }
        // Note: position-resave is optional for MVP. The comment re-save here
        // is a no-op that just keeps local state consistent.
        onEdit(highlight.annotationId, highlight.comment)
        toggleEditInProgress(false)
      }}
      bounds={highlightBindings.textLayer}
      onEditStart={() => !isReadOnly && toggleEditInProgress(true)}
    />
  ) : (
    <TextHighlight
      isScrolledTo={isScrolledTo}
      highlight={highlight}
    />
  )

  const highlightTip = {
    position: highlight.position,
    content: (
      <AnnotationPopup
        highlight={highlight as unknown as AnnotationHighlight}
        onEdit={onEdit}
        onDelete={onDelete}
        isReadOnly={isReadOnly}
      />
    ),
  }

  return (
    <MonitoredHighlightContainer
      key={highlight.id}
      highlightTip={highlightTip}
    >
      {renderedHighlight}
    </MonitoredHighlightContainer>
  )
}