// src/components/review/PDFViewer.tsx
'use client'

import { useRef, useState, useCallback } from 'react'
import {
  PdfLoader,
  PdfHighlighter,
} from 'react-pdf-highlighter-extended'
import type { PdfHighlighterUtils, Highlight } from 'react-pdf-highlighter-extended'
import type { AnnotationHighlight, AnnotationRecord } from '@/types/annotations'
import { createAnnotation } from '@/lib/actions/annotations'
import HighlightContainer from './HighlightContainer'
import AnnotationSidebar from './AnnotationSidebar'
import AnnotationTip from './AnnotationTip'

// Convert a DB annotation record into the shape the library expects
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
      // Determine type from position shape:
      // Text selections have `rects`, area drags have only `boundingRect`
      const type: 'text' | 'area' =
        position.rects && position.rects.length > 0 ? 'text' : 'area'

      // Optimistically add to local state with a temporary id
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

      // Dismiss the selection tip immediately so the UI feels snappy
      highlighterUtilsRef.current?.setTip(null)

      // Save to Supabase
      const { id, error } = await createAnnotation({
        reviewId,
        type,
        pageNumber:
          position.boundingRect.pageNumber ??
          (position.boundingRect as any)?.pageNumber ??
          1,
        position,
        comment,
      })

      if (error || !id) {
        // Roll back the optimistic update if the save failed
        setHighlights((prev) => prev.filter((h) => h.id !== tempId))
        console.error('Failed to save annotation:', error)
        return
      }

      // Swap the temp id for the real DB id
      setHighlights((prev) =>
        prev.map((h) => (h.id === tempId ? { ...h, id, annotationId: id } : h))
      )
    },
    [reviewId]
  )

  const handleEditHighlight = useCallback(
    (annotationId: string, newComment: string) => {
      setHighlights((prev) =>
        prev.map((h) =>
          h.annotationId === annotationId ? { ...h, comment: newComment } : h
        )
      )
    },
    []
  )

  const handleDeleteHighlight = useCallback((annotationId: string) => {
    setHighlights((prev) => prev.filter((h) => h.annotationId !== annotationId))
  }, [])

  return (
    <div className="flex h-full overflow-hidden">
      <div className="w-[70%] h-full overflow-auto relative">
        <PdfLoader
          document={pdfUrl}
          beforeLoad={() => (
            <div className="flex items-center justify-center h-full min-h-96">
              <p className="text-gray-400 text-sm">Loading PDF...</p>
            </div>
          )}
        >
          {(pdfDocument) => (
            <PdfHighlighter
              pdfDocument={pdfDocument}
              highlights={highlights}
              enableAreaSelection={(event) => event.altKey}
              utilsRef={(_utils) => {
                highlighterUtilsRef.current = _utils
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
              style={{ height: '100%' }}
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

      <div className="w-[30%] h-full border-l border-gray-200 overflow-y-auto bg-white flex flex-col">
        <div className="p-3 border-b border-gray-200 shrink-0">
          <h3 className="text-sm font-semibold text-gray-700">
            Annotations
            <span className="ml-1.5 text-xs font-normal text-gray-400">
              ({highlights.length})
            </span>
          </h3>
          {!isReadOnly && (
            <p className="text-xs text-gray-400 mt-0.5">
              Select text · or{' '}
              <kbd className="bg-gray-100 px-1 rounded">Alt</kbd>
              +drag for area
            </p>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          <AnnotationSidebar
            annotations={highlights}
            highlighterUtilsRef={highlighterUtilsRef}
          />
        </div>
      </div>

    </div>
  )
}