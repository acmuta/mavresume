'use client'

import type { PdfHighlighterUtils } from 'react-pdf-highlighter-extended'

import type { AnnotationHighlight } from '@/types/annotations'

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
      <div className="px-6 py-10 text-center">
        <div className="rounded-2xl border border-dashed border-[#2d313a] bg-[#111219]/80 p-6">
          <p className="text-sm font-medium text-white">No annotations yet</p>
          <p className="mt-2 text-sm leading-relaxed text-[#6d7895]">
            Select text or hold{' '}
            <kbd className="rounded border border-[#3d4353] bg-[#1a1d24] px-1.5 py-0.5 text-[11px] text-[#cfd3e1]">
              Alt
            </kbd>{' '}
            + drag to annotate the PDF.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="divide-y divide-[#20242d]">
      {annotations.map((annotation, index) => (
        <div
          key={annotation.annotationId}
          className="p-4 transition-colors hover:bg-[#111219]"
        >
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-[#6d7895]">
            #{index + 1} · Page {annotation.position.boundingRect.pageNumber} · {annotation.type}
          </p>
          <p className="line-clamp-4 whitespace-pre-wrap text-sm leading-relaxed text-[#cfd3e1]">
            {annotation.comment}
          </p>
          <button
            onClick={() => scrollTo(annotation)}
            className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-[#89a5ff] transition hover:text-white"
          >
            Jump to annotation
          </button>
        </div>
      ))}
    </div>
  )
}
