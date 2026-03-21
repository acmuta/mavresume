import Link from "next/link";
import { ArrowLeft, Clock3, FileText, MessageSquareText } from "lucide-react";
import { redirect, notFound } from "next/navigation";

import { getAnnotationsForReview } from "@/lib/actions/annotations";
import { getUserWithSession } from "@/lib/auth/getUser";
import ReviewMetadata from "@/components/review/ReviewMetadata";
import PDFViewerDynamic from "@/components/review/PDFViewerDynamic";
import ReviewerActionsBar from "@/components/review/ReviewerActionsBar";
import { getResumeSignedUrl } from "@/lib/resume/getResumeUrl";
import { getReviewDetail } from "@/lib/review/getReviewDetail";

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

  if (role === "student" && review.student_id !== user.id) {
    redirect("/dashboard");
  }
  if (role === "reviewer" && review.reviewer_id !== user.id) {
    redirect("/reviewer/dashboard");
  }

  if (!review.resume_versions?.pdf_path) {
    notFound();
  }
  const pdfUrl = await getResumeSignedUrl(review.resume_versions.pdf_path);
  const initialAnnotations = await getAnnotationsForReview(id);

  const shouldShowPdf =
    role === "student"
      ? review.status === "completed"
      : review.status === "accepted";

  const isReadOnly = role === "student" || review.status === "completed";

  const statusLabels: Record<string, { label: string; color: string }> = {
    pending: {
      label: "Pending",
      color: "border-[#f5c76b]/30 bg-[#f59e0b]/12 text-[#f5c76b]",
    },
    accepted: {
      label: "In Review",
      color: "border-[#274cbc]/40 bg-[#274cbc]/15 text-[#8fa5ff]",
    },
    completed: {
      label: "Completed",
      color: "border-[#58f5c3]/30 bg-[#58f5c3]/12 text-[#58f5c3]",
    },
  };

  const statusDisplay = statusLabels[review.status] ?? statusLabels.pending;
  const viewerRole =
    role === "student" || role === "reviewer" || role === "admin"
      ? role
      : "student";
  const backHref =
    viewerRole === "student" ? "/dashboard" : "/reviewer/dashboard";
  const pageDescription =
    viewerRole === "student"
      ? "Review details and annotated feedback for your submitted resume."
      : "Annotate the submitted PDF, leave contextual notes, and complete the summary when you are done.";

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
        <section className="relative overflow-hidden rounded-3xl border-2 border-dashed border-[#2c3037] bg-[radial-gradient(circle_at_top,_#1c2233,_#101113_70%)] px-5 py-4 shadow-[0_25px_60px_rgba(3,4,7,0.55)] md:px-6 md:py-5">
          <div className="absolute inset-0 opacity-70">
            <div className="absolute -top-24 left-16 h-64 w-64 rounded-full bg-[#274cbc]/25 blur-[100px]" />
            <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-[#19c8ff]/15 blur-[80px]" />
          </div>

          <div className="relative flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={backHref}
                      className="inline-flex items-center gap-2 rounded-full border border-[#2b3242] bg-[#10121a] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#cfd3e1] transition hover:border-[#3f4a67] hover:text-white"
                    >
                      <ArrowLeft className="size-4" />
                      Back
                    </Link>

                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusDisplay.color}`}
                    >
                      {statusDisplay.label}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-[#2b3242] bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#89a5ff]">
                      {isReadOnly ? "Read only" : "Annotation enabled"}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div
                      className="font-bold tracking-tight text-lg md:text-2xl 
                mask-[linear-gradient(to_bottom,black_40%,transparent)] 
                mask-size-[100%_100%] mask-no-repeat pointer-events-none"
                    >
                      RESUME<span className="font-extralight">REVIEW</span>
                    </div>
                    <p className="mt-1 max-w-2xl text-sm text-[#cfd3e1] md:text-base">
                      {pageDescription}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[520px]">
                  <div className="rounded-2xl border border-dashed border-[#2d313a] bg-[#111219]/80 p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-[#89a5ff]">
                      <FileText className="size-4" />
                      <span className="text-xs font-medium uppercase tracking-[0.2em]">
                        Resume
                      </span>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm font-medium text-white">
                      {review.resume_versions?.label ??
                        review.resume_versions?.file_name ??
                        "Resume"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-dashed border-[#2d313a] bg-[#111219]/80 p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-[#8fa5ff]">
                      <Clock3 className="size-4" />
                      <span className="text-xs font-medium uppercase tracking-[0.2em]">
                        Submitted
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-medium text-white">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-dashed border-[#2d313a] bg-[#111219]/80 p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-[#58f5c3]">
                      <MessageSquareText className="size-4" />
                      <span className="text-xs font-medium uppercase tracking-[0.2em]">
                        Notes
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-medium text-white">
                      {initialAnnotations.length} annotation
                      {initialAnnotations.length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="overflow-hidden rounded-3xl border-2 border-dashed border-[#2d313a] bg-[#15171c]/80 shadow-[0_20px_60px_rgba(9,10,12,0.35)] backdrop-blur-md">
            {shouldShowPdf ? (
              <PDFViewerDynamic
                pdfUrl={pdfUrl}
                reviewId={id}
                initialAnnotations={initialAnnotations}
                isReadOnly={isReadOnly}
              />
            ) : (
              <div className="flex min-h-[720px] items-center justify-center bg-[#0f1117] px-8 text-center">
                <div className="max-w-md rounded-2xl border border-dashed border-[#2d313a] bg-[#111219]/80 p-8">
                  <p className="text-lg font-semibold text-white">
                    Review workspace unavailable
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[#6d7895]">
                    {viewerRole === "student"
                      ? "Your review is still in progress. The annotated PDF and summary will appear here after the reviewer completes it."
                      : "This review is not currently open for annotation. Claim it from the dashboard before editing, or reopen it from your active queue if it is already assigned to you."}
                  </p>
                </div>
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-6">
            <ReviewMetadata
              priority={review.priority}
              studentNotes={review.student_notes}
              resumeLabel={review.resume_versions?.label ?? null}
              fileName={review.resume_versions?.file_name ?? null}
              submittedAt={review.created_at}
              claimedAt={review.claimed_at}
              completedAt={review.completed_at}
              reviewerFeedback={review.reviewer_feedback}
              viewerRole={viewerRole}
            />

            {(viewerRole === "reviewer" || viewerRole === "admin") &&
              review.status === "accepted" && (
                <ReviewerActionsBar
                  reviewId={id}
                  existingFeedback={review.reviewer_feedback}
                />
              )}
          </aside>
        </div>
      </div>
    </div>
  );
}
