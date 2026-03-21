// src/lib/resume/uploadResume.ts
import { pdf } from "@react-pdf/renderer";

import { ResumeDoc } from "@/components/elements/resume/ResumeDoc";
import { createClient } from '@/lib/supabase/client'

type UploadResult = {
  versionId: string
  pdfPath: string
}

async function createResumeVersionFromFile(
  file: File,
  {
    label,
    source = "upload",
  }: {
    label?: string;
    source?: "upload";
  } = {},
): Promise<UploadResult> {
  const supabase = createClient() 

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')

  const userId = session.user.id

  // 1. Build a unique storage path: /{userId}/{timestamp}-{filename}
  const timestamp = Date.now()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const pdfPath = `${userId}/${timestamp}-${safeName}`

  // 2. Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('resumes')
    .upload(pdfPath, file, {
      contentType: 'application/pdf',
      upsert: false, // never overwrite — always a new file
    })

  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

  // 3. Record the version in the database
  const { data: version, error: dbError } = await supabase
    .from('resume_versions')
    .insert({
      student_id: userId,
      pdf_path: pdfPath,
      file_name: file.name,
      file_size: file.size,
      label: label ?? file.name.replace('.pdf', ''),
      source,
    })
    .select()
    .single()

  if (dbError) {
    // If DB insert fails, clean up the uploaded file
    await supabase.storage.from('resumes').remove([pdfPath])
    throw new Error(`Failed to save resume record: ${dbError.message}`)
  }

  return { versionId: version.id, pdfPath }
}

export async function uploadResume(
  file: File,
  label?: string
): Promise<UploadResult> {
  return createResumeVersionFromFile(file, {
    label,
    source: "upload",
  });
}

export async function uploadCurrentBuilderResume(
  fileName: string,
  label?: string,
): Promise<UploadResult> {
  const blob = await pdf(<ResumeDoc />).toBlob();
  const file = new File([blob], fileName, {
    type: "application/pdf",
    lastModified: Date.now(),
  });

  return createResumeVersionFromFile(file, {
    label,
    source: "upload",
  });
}
