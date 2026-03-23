'use client'

import dynamic from 'next/dynamic'

const PDFViewerClient = dynamic(() => import('./PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[720px] items-center justify-center bg-[#0f1117]">
      <div className="rounded-full border border-[#2b3242] bg-[#111219]/90 px-4 py-2 text-sm text-[#cfd3e1]">
        Loading PDF viewer...
      </div>
    </div>
  ),
})

export default PDFViewerClient
