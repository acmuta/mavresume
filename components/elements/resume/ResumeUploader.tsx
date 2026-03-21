'use client'

import { useCallback, useState } from 'react'
import { AlertCircle, FileCheck2, Loader2, UploadCloud } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

import { uploadResume } from '@/lib/resume/uploadResume'

type Props = {
  onUploadComplete: (versionId: string) => void
  label?: string
}

export function ResumeUploader({ onUploadComplete, label }: Props) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [fileName, setFileName] = useState('')

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setErrorMsg('Only PDF files are accepted')
      setStatus('error')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File must be under 10MB')
      setStatus('error')
      return
    }

    setFileName(file.name)
    setStatus('uploading')
    setErrorMsg('')

    try {
      const { versionId } = await uploadResume(file, label)
      setStatus('success')
      onUploadComplete(versionId)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed')
    }
  }, [label, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: status === 'uploading',
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          rounded-2xl border-2 border-dashed p-8 text-center transition-all
          ${isDragActive ? 'border-[#274cbc] bg-[#274cbc]/10' : 'border-[#2d313a] bg-[#10121a] hover:border-[#3f4a67] hover:bg-[#15171c]'}
          ${status === 'uploading' ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
          ${status === 'success' ? 'border-[#58f5c3]/40 bg-[#58f5c3]/10' : ''}
          ${status === 'error' ? 'border-red-400/60 bg-red-500/10' : ''}
        `}
      >
        <input {...getInputProps()} />

        {status === 'idle' && (
          <div className="flex flex-col items-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#1f2330]/80 text-[#8fa5ff]">
              <UploadCloud className="size-5" />
            </div>
            <p className="mt-4 font-medium text-white">
              {isDragActive ? 'Drop your PDF here' : 'Drag & drop your resume PDF here'}
            </p>
            <p className="mt-1 text-sm text-[#6d7895]">or click to browse. PDF only, max 10MB.</p>
          </div>
        )}

        {status === 'uploading' && (
          <div className="flex flex-col items-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#274cbc]/20 text-[#8fa5ff]">
              <Loader2 className="size-5 animate-spin" />
            </div>
            <p className="mt-4 font-medium text-white">Uploading {fileName}...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#58f5c3]/15 text-[#58f5c3]">
              <FileCheck2 className="size-5" />
            </div>
            <p className="mt-4 font-medium text-white">{fileName} uploaded</p>
            <p className="mt-1 text-sm text-[#6d7895]">Click or drop again to replace it.</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <AlertCircle className="size-5" />
            </div>
            <p className="mt-4 font-medium text-red-300">Upload failed</p>
            <p className="mt-1 text-sm text-red-300/90">{errorMsg}</p>
            <p className="mt-2 text-sm text-[#6d7895]">Click to try again.</p>
          </div>
        )}
      </div>
    </div>
  )
}
