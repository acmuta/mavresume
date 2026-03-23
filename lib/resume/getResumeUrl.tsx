import { createClient } from "../supabase/server";

export async function getResumeSignedUrl(pdfPath: string): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("resumes")
    .createSignedUrl(pdfPath, 60 * 60);

  if (error || !data?.signedUrl) {
    throw new Error(`Failed to generate signed URL for path: ${pdfPath}`);
  }

  return data.signedUrl;
}
