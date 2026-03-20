// src/components/review/AnnotationSidebar.tsx
'use client'

import type { AnnotationHighlight } from '@/types/annotations'
import type { PdfHighlighterUtils } from 'react-pdf-highlighter-extended'

type Props = {
  annotations: AnnotationHighlight[]
  highlighterUtilsRef: React.MutableRefObject<PdfHighlighterUtils | undefined>
}

export default function AnnotationSidebar({ annotations, highlighterUtilsRef }: Props) {
  function scrollTo(annotation: AnnotationHighlight) {
    highlighterUtilsRef.current?.scrollToHighlight(annotation)
  }

  if (annotations.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-400 text-center mt-8">
        No annotations yet.
        <br />
        Select text or hold{' '}
        <kbd className="bg-gray-100 px-1 rounded text-xs">Alt</kbd>
        {' '}+ drag to annotate.
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {annotations.map((annotation, index) => (
        <div key={annotation.annotationId} className="p-4 hover:bg-gray-50">
          <p className="text-xs font-medium text-gray-400 mb-1">
            #{index + 1} · Page {annotation.position.boundingRect.pageNumber} · {annotation.type}
          </p>
          <p className="text-sm text-gray-800 whitespace-pre-wrap line-clamp-4">
            {annotation.comment}
          </p>
          <button
            onClick={() => scrollTo(annotation)}
            className="mt-2 text-xs text-indigo-600 hover:underline"
          >
            Jump to →
          </button>
        </div>
      ))}
    </div>
  )
}