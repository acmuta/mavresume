'use client'

import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'
import type PDFViewer from './PDFViewer'

const PDFViewerClient = dynamic(() => import('./PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <p className="text-gray-400 text-sm">Loading PDF viewer...</p>
    </div>
  ),
})

export default PDFViewerClient