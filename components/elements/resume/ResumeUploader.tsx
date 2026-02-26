'use client'
import { useState, useCallback } from 'react'
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

    // Client-side validation
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
      onUploadComplete(versionId) // pass version ID up to parent
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
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${status === 'uploading' ? 'opacity-50 cursor-not-allowed' : ''}
          ${status === 'success' ? 'border-green-500 bg-green-50' : ''}
          ${status === 'error' ? 'border-red-400 bg-red-50' : ''}
        `}
      >
        <input {...getInputProps()} />

        {status === 'idle' && (
          <div>
            <p className="text-gray-600 font-medium">
              {isDragActive ? 'Drop your PDF here' : 'Drag & drop your resume PDF here'}
            </p>
            <p className="text-sm text-gray-400 mt-1">or click to browse — max 10MB</p>
          </div>
        )}

        {status === 'uploading' && (
          <p className="text-blue-600 font-medium">Uploading {fileName}...</p>
        )}

        {status === 'success' && (
          <div>
            <p className="text-green-600 font-medium">✓ {fileName} uploaded</p>
            <p className="text-sm text-gray-500 mt-1">Click or drop again to replace</p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <p className="text-red-600 font-medium">Upload failed</p>
            <p className="text-sm text-red-500 mt-1">{errorMsg}</p>
            <p className="text-sm text-gray-400 mt-2">Click to try again</p>
          </div>
        )}
      </div>
    </div>
  )
}