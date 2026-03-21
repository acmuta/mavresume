'use client'

import { useCallback, useRef, useState } from 'react'
import { Loader2, MessageSquareText, ScanSearch } from 'lucide-react'
import { PdfHighlighter, PdfLoader } from 'react-pdf-highlighter-extended'
import type { Highlight, PdfHighlighterUtils } from 'react-pdf-highlighter-extended'

import { createAnnotation } from '@/lib/actions/annotations'
import type { AnnotationHighlight, AnnotationRecord } from '@/types/annotations'
import AnnotationSidebar from './AnnotationSidebar'
import AnnotationTip from './AnnotationTip'
import HighlightContainer from './HighlightContainer'

function recordToHighlight(record: AnnotationRecord): AnnotationHighlight {
  return {
    id: record.id,
    annotationId: record.id,
    comment: record.comment,
    type: record.type,
    position: record.position as Highlight['position'],
    content: {},
  }
}

type Props = {
  pdfUrl: string
  reviewId: string
  initialAnnotations: AnnotationRecord[]
  isReadOnly: boolean
}

export default function PDFViewer({
  pdfUrl,
  reviewId,
  initialAnnotations,
  isReadOnly,
}: Props) {
  const highlighterUtilsRef = useRef<PdfHighlighterUtils>()
  const [highlights, setHighlights] = useState<AnnotationHighlight[]>(
    initialAnnotations.map(recordToHighlight)
  )

  const handleAddHighlight = useCallback(
    async (position: Highlight['position'], comment: string) => {
      const type: 'text' | 'area' =
        position.rects && position.rects.length > 0 ? 'text' : 'area'

      const tempId = `temp-${Date.now()}`
      const optimisticHighlight: AnnotationHighlight = {
        id: tempId,
        annotationId: tempId,
        comment,
        type,
        position,
        content: {},
      }
      setHighlights((prev) => [...prev, optimisticHighlight])
      highlighterUtilsRef.current?.setTip(null)

      const { id, error } = await createAnnotation({
        reviewId,
        type,
        pageNumber:
          (position.boundingRect as Partial<{ pageNumber: number }>).pageNumber ??
          1,
        position,
        comment,
      })

      if (error || !id) {
        setHighlights((prev) => prev.filter((highlight) => highlight.id !== tempId))
        console.error('Failed to save annotation:', error)
        return
      }

      setHighlights((prev) =>
        prev.map((highlight) =>
          highlight.id === tempId
            ? { ...highlight, id, annotationId: id }
            : highlight
        )
      )
    },
    [reviewId]
  )

  const handleEditHighlight = useCallback(
    (annotationId: string, newComment: string) => {
      setHighlights((prev) =>
        prev.map((highlight) =>
          highlight.annotationId === annotationId
            ? { ...highlight, comment: newComment }
            : highlight
        )
      )
    },
    []
  )

  const handleDeleteHighlight = useCallback((annotationId: string) => {
    setHighlights((prev) =>
      prev.filter((highlight) => highlight.annotationId !== annotationId)
    )
  }, [])

  return (
    <div className="flex h-full min-h-[720px] flex-col overflow-visible xl:flex-row">
      <div className="relative min-h-[520px] flex-1 overflow-visible bg-[#0f1117]">
        <PdfLoader
          document={pdfUrl}
          beforeLoad={() => (
            <div className="flex h-full min-h-[520px] items-center justify-center">
              <div className="flex items-center gap-3 rounded-full border border-[#2b3242] bg-[#111219]/90 px-4 py-2 text-sm text-[#cfd3e1]">
                <Loader2 className="size-4 animate-spin text-[#89a5ff]" />
                Loading PDF...
              </div>
            </div>
          )}
        >
          {(pdfDocument) => (
            <PdfHighlighter
              pdfDocument={pdfDocument}
              highlights={highlights}
              enableAreaSelection={(event) => event.altKey}
              utilsRef={(utils) => {
                highlighterUtilsRef.current = utils
              }}
              selectionTip={
                isReadOnly ? undefined : (
                  <AnnotationTip
                    onConfirm={(comment) => {
                      const selection =
                        highlighterUtilsRef.current?.getCurrentSelection()
                      if (selection) {
                        handleAddHighlight(selection.position, comment)
                      }
                    }}
                    onCancel={() => highlighterUtilsRef.current?.setTip(null)}
                  />
                )
              }
              style={{ height: '100%', overflowX: 'visible', overflowY: 'auto' }}
            >
              <HighlightContainer
                onEdit={handleEditHighlight}
                onDelete={handleDeleteHighlight}
                isReadOnly={isReadOnly}
              />
            </PdfHighlighter>
          )}
        </PdfLoader>
      </div>

      <aside className="flex h-[320px] w-full flex-col border-t border-[#2d313a] bg-[#15171c]/95 xl:h-auto xl:w-[360px] xl:border-l xl:border-t-0">
        <div className="shrink-0 border-b border-[#2d313a] p-4">
          <div className="flex items-center gap-2 text-[#89a5ff]">
            <MessageSquareText className="size-4" />
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#cfd3e1]">
              Annotations
            </h3>
          </div>
          <p className="mt-2 text-sm font-medium text-white">
            Annotation list
            <span className="ml-1.5 text-xs font-normal text-[#6d7895]">
              ({highlights.length})
            </span>
          </p>
          {!isReadOnly && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-[#6d7895]">
              <ScanSearch className="size-3.5" />
              Select text or use{' '}
              <kbd className="rounded border border-[#3d4353] bg-[#1a1d24] px-1.5 py-0.5 text-[11px] text-[#cfd3e1]">
                Alt
              </kbd>
              + drag for area notes
            </p>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          <AnnotationSidebar
            annotations={highlights}
            highlighterUtilsRef={highlighterUtilsRef}
          />
        </div>
      </aside>
    </div>
  )
}
