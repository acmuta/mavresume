'use client'

import { useState, useLayoutEffect } from 'react'
import { usePdfHighlighterContext } from 'react-pdf-highlighter-extended'

type Props = {
  onConfirm: (comment: string) => void
  onCancel: () => void
}

export default function AnnotationTip({ onConfirm, onCancel }: Props) {
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const { updateTipPosition } = usePdfHighlighterContext()

  // Re-position the tip if its height changes as the textarea grows
  useLayoutEffect(() => {
    updateTipPosition?.()
  }, [comment])

  async function handleConfirm() {
    if (!comment.trim()) return
    setSaving(true)
    await onConfirm(comment.trim())
    setSaving(false)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-64">
      <textarea
        autoFocus
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        rows={3}
        className="w-full text-sm border border-gray-200 rounded px-2 py-1 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleConfirm()
          if (e.key === 'Escape') onCancel()
        }}
      />
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={onCancel}
          className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={!comment.trim() || saving}
          className="text-xs px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Add'}
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-1">⌘+Enter to save · Esc to cancel</p>
    </div>
  )
}