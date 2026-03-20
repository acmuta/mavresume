import { redirect, notFound } from "next/navigation";
import { getUserWithSession } from "@/lib/auth/getUser";
import { getReviewDetail } from "@/lib/review/getReviewDetail";
import { getResumeSignedUrl } from "@/lib/resume/getResumeUrl";
import { getAnnotationsForReview } from "@/lib/actions/annotations";
import ReviewMetadata from "@/components/review/ReviewMetadata";
import ReviewerActionsBar from "@/components/review/ReviewerActionsBar";
import PDFViewerDynamic from "@/components/review/PDFViewerDynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ReviewDetailPage({ params }: Props) {
  const result = await getUserWithSession();
  const user = result?.user ?? null;
  const session = result?.session ?? null;
  const { id } = await params;

  if (!user) redirect("/login?next=/review/" + id);
  const review = await getReviewDetail(id);
  if (!review) {
    notFound();
  }

  const accessToken = session?.access_token;
  const payload = accessToken
    ? JSON.parse(atob(accessToken.split(".")[1]))
    : null;
  const role = payload?.user_role;

  // Access control — unchanged from review workflow step
  if (role === "student" && review.student_id !== user.id)
    redirect("/dashboard");
  if (role === "reviewer" && review.reviewer_id !== user.id)
    redirect("/reviewer/dashboard");

  // Generate the signed PDF URL server-side

  if (!review.resume_versions?.pdf_path) {
    notFound();
  }
  const pdfUrl = await getResumeSignedUrl(review.resume_versions.pdf_path);

  // Preload annotations server-side
  const initialAnnotations = await getAnnotationsForReview(id);

  // Students see the PDF only on completed reviews
  // Reviewers see it once they have claimed (status = accepted)
  const shouldShowPdf =
    role === "student"
      ? review.status === "completed"
      : review.status === "accepted";

  // Read-only if student, or if reviewer viewing a completed review
  const isReadOnly = role === "student" || review.status === "completed";

  const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: "Pending", color: "text-yellow-600 bg-yellow-50" },
    accepted: { label: "In Review", color: "text-blue-600 bg-blue-50" },
    completed: { label: "Completed", color: "text-green-600 bg-green-50" },
  };
  const statusDisplay = statusLabels[review.status] ?? statusLabels.pending;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="shrink-0 border-b border-gray-200 bg-white px-4 py-3 flex items-center gap-3">
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${statusDisplay.color}`}
        >
          {statusDisplay.label}
        </span>
        <h1 className="text-base font-semibold text-gray-900">Resume Review</h1>
        <div className="ml-auto text-xs text-gray-400 truncate max-w-xs">
          {review.resume_versions?.label ??
            review.resume_versions?.file_name ??
            "Resume"}
        </div>
      </div>

      {/* ── Main: PDF viewer + annotation sidebar ──────────────────────── */}
      <div className="flex-1 overflow-hidden">
        {shouldShowPdf ? (
          <PDFViewerDynamic
            pdfUrl={pdfUrl}
            reviewId={id}
            initialAnnotations={initialAnnotations}
            isReadOnly={isReadOnly}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <p className="text-gray-400 text-sm text-center px-8">
              {role === "student"
                ? "Your review is still in progress. You will be able to view feedback once it is completed."
                : "Claim this review from your dashboard to begin annotating."}
            </p>
          </div>
        )}
      </div>

      {/* ── Collapsible metadata panel ──────────────────────────────────── */}
      <div className="shrink-0 border-t border-gray-200 bg-white">
        <details className="group">
          <summary className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2 select-none">
            <span>Review Details</span>
            <span className="text-gray-400 text-xs group-open:hidden">▶</span>
            <span className="text-gray-400 text-xs hidden group-open:inline">
              ▼
            </span>
          </summary>
          <div className="p-4 border-t border-gray-100 max-h-64 overflow-y-auto">
            <ReviewMetadata
              priority={review.priority}
              studentNotes={review.student_notes}
              resumeLabel={review.resume_versions?.label ?? null}
              fileName={review.resume_versions?.file_name ?? null}
              submittedAt={review.created_at}
              claimedAt={review.claimed_at}
              completedAt={review.completed_at}
              reviewerFeedback={review.reviewer_feedback}
              viewerRole={role}
            />
          </div>
        </details>
      </div>

      {/* ── Reviewer actions bar ────────────────────────────────────────── */}
      {(role === "reviewer" || role === "admin") &&
        review.status === "accepted" && (
          <div className="shrink-0">
            <ReviewerActionsBar
              reviewId={id}
              existingFeedback={review.reviewer_feedback}
            />
          </div>
        )}
    </div>
  );
}
