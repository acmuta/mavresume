'use client'

import { useLayoutEffect, useState } from 'react'
import { usePdfHighlighterContext } from 'react-pdf-highlighter-extended'

import { Button } from '@/components/ui/button'

type Props = {
  onConfirm: (comment: string) => void
  onCancel: () => void
}

export default function AnnotationTip({ onConfirm, onCancel }: Props) {
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const { updateTipPosition } = usePdfHighlighterContext()

  useLayoutEffect(() => {
    updateTipPosition?.()
  }, [comment, updateTipPosition])

  async function handleConfirm() {
    if (!comment.trim()) return
    setSaving(true)
    await onConfirm(comment.trim())
    setSaving(false)
  }

  return (
    <div className="w-64 max-w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-dashed border-[#2d313a] bg-[#111219]/95 p-4 text-white shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur-md sm:w-72">
      <textarea
        autoFocus
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        rows={3}
        className="w-full resize-none rounded-xl border border-dashed border-[#3d4353] bg-[#1a1d24] px-3 py-2 text-sm text-white placeholder:text-[#6d7895] outline-none transition focus:border-[#274cbc]"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleConfirm()
          if (e.key === 'Escape') onCancel()
        }}
      />
      <div className="mt-3 flex justify-end gap-2">
        <Button
          onClick={onCancel}
          variant="ghost"
          size="sm"
          className="rounded-lg text-xs text-[#cfd3e1] hover:bg-white/5 hover:text-white"
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!comment.trim() || saving}
          size="sm"
          className="rounded-lg bg-[#274cbc] text-xs font-semibold text-white hover:bg-[#315be1]"
        >
          {saving ? 'Saving...' : 'Add'}
        </Button>
      </div>
      <p className="mt-2 text-xs text-[#6d7895]">Cmd/Ctrl+Enter to save · Esc to cancel</p>
    </div>
  )
}
