'use client'

import { useState } from 'react'
import {
  AreaHighlight,
  MonitoredHighlightContainer,
  TextHighlight,
  useHighlightContainerContext,
  usePdfHighlighterContext,
} from 'react-pdf-highlighter-extended'

import { Button } from '@/components/ui/button'
import { deleteAnnotation, updateAnnotation } from '@/lib/actions/annotations'
import type { AnnotationHighlight } from '@/types/annotations'

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
    <div className="w-64 max-w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-dashed border-[#2d313a] bg-[#111219]/95 p-4 text-sm text-white shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur-md sm:w-72">
      {editing ? (
        <>
          <textarea
            autoFocus
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border border-dashed border-[#3d4353] bg-[#1a1d24] px-3 py-2 text-sm text-white outline-none transition focus:border-[#274cbc]"
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button
              onClick={() => {
                setEditing(false)
                setEditComment(highlight.comment)
              }}
              variant="ghost"
              size="sm"
              className="rounded-lg text-xs text-[#cfd3e1] hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={saving || !editComment.trim()}
              size="sm"
              className="rounded-lg bg-[#274cbc] text-xs font-semibold text-white hover:bg-[#315be1]"
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="whitespace-pre-wrap leading-relaxed text-[#cfd3e1]">
            {highlight.comment}
          </p>
          {!isReadOnly && (
            <div className="mt-3 flex gap-2 border-t border-[#20242d] pt-3">
              <button
                onClick={() => setEditing(true)}
                className="text-xs font-medium uppercase tracking-[0.16em] text-[#89a5ff] transition hover:text-white"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-xs font-medium uppercase tracking-[0.16em] text-red-400 transition hover:text-red-300 disabled:opacity-50"
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
  } = useHighlightContainerContext<AnnotationHighlight>()

  const { toggleEditInProgress } = usePdfHighlighterContext()

  const isAreaHighlight = Boolean(highlight.content?.image)

  const renderedHighlight = isAreaHighlight ? (
    <AreaHighlight
      isScrolledTo={isScrolledTo}
      highlight={highlight}
      onChange={() => {
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
