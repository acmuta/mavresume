import { ClipboardCheck, Clock3, Inbox, Layers3 } from "lucide-react";

import ReviewQueueTable from "@/components/review/ReviewQueueTable";
import { requireRole } from "@/lib/auth/getUser";
import { getReviewerDashboardData } from "@/lib/reviewer/getReviewerDashboardData";

export default async function ReviewerDashboardPage() {
  const user = await requireRole("reviewer", "admin");
  const { pendingRequests, activeReviews } = await getReviewerDashboardData(
    user.id,
  );
  const displayName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "Reviewer";

  return (
    <div className="px-6 py-10 md:px-10 md:py-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="relative overflow-hidden rounded-3xl border-2 border-dashed border-[#2c3037] bg-[radial-gradient(circle_at_top,_#1c2233,_#101113_70%)] p-8 shadow-[0_25px_60px_rgba(3,4,7,0.55)]">
          <div className="absolute inset-0 opacity-70">
            <div className="absolute -top-24 left-16 h-64 w-64 rounded-full bg-[#274cbc]/25 blur-[100px]" />
            <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-[#19c8ff]/15 blur-[80px]" />
          </div>

          <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-[#2b3242] bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#89a5ff] backdrop-blur">
                Reviewer workspace
              </span>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white md:text-5xl">
                Review queue for {displayName}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-[#cfd3e1] md:text-base">
                Claim pending resumes, continue active reviews, and keep the
                feedback workflow in one place without leaving the dashboard.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-dashed border-[#2d313a] bg-[#111219]/80 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[#89a5ff]">
                  <Layers3 className="size-4" />
                  <span className="text-xs font-medium uppercase tracking-[0.2em]">
                    Total queue
                  </span>
                </div>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {pendingRequests.length + activeReviews.length}
                </p>
              </div>
              <div className="rounded-2xl border border-dashed border-[#2d313a] bg-[#111219]/80 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[#8fa5ff]">
                  <Clock3 className="size-4" />
                  <span className="text-xs font-medium uppercase tracking-[0.2em]">
                    In progress
                  </span>
                </div>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {activeReviews.length}
                </p>
              </div>
              <div className="rounded-2xl border border-dashed border-[#2d313a] bg-[#111219]/80 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[#58f5c3]">
                  <Inbox className="size-4" />
                  <span className="text-xs font-medium uppercase tracking-[0.2em]">
                    Awaiting claim
                  </span>
                </div>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {pendingRequests.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6">
          <div className="rounded-2xl border-2 border-dashed border-[#2d313a] bg-[#15171c]/80 p-6 shadow-[0_20px_60px_rgba(9,10,12,0.35)] backdrop-blur-md">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[#cfd3e1]">
                  <ClipboardCheck className="size-4 text-[#89a5ff]" />
                  <h2 className="text-xl font-semibold text-white">
                    My Active Reviews
                  </h2>
                </div>
                <p className="mt-2 text-sm text-[#6d7895]">
                  Reviews you have already claimed and can continue annotating.
                </p>
              </div>
              <span className="rounded-full border border-[#2b3242] bg-[#10121a] px-3 py-1 text-xs font-medium text-[#cfd3e1]">
                {activeReviews.length}
              </span>
            </div>

            {activeReviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#2d313a] bg-[#111219]/80 px-6 py-12 text-center">
                <Clock3 className="mx-auto size-10 text-[#3d4353]" />
                <p className="mt-4 text-base font-medium text-white">
                  No active reviews
                </p>
                <p className="mt-2 text-sm text-[#6d7895]">
                  Claim a pending request to start leaving annotations.
                </p>
              </div>
            ) : (
              <ReviewQueueTable reviews={activeReviews} mode="active" />
            )}
          </div>

          <div className="rounded-2xl border-2 border-dashed border-[#2d313a] bg-[#15171c]/80 p-6 shadow-[0_20px_60px_rgba(9,10,12,0.35)] backdrop-blur-md">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[#cfd3e1]">
                  <Inbox className="size-4 text-[#58f5c3]" />
                  <h2 className="text-xl font-semibold text-white">
                    Pending Requests
                  </h2>
                </div>
                <p className="mt-2 text-sm text-[#6d7895]">
                  Fresh submissions available for reviewers to claim. Optimized
                  for scanning and processing larger queues quickly.
                </p>
              </div>
              <span className="rounded-full border border-[#2b3242] bg-[#10121a] px-3 py-1 text-xs font-medium text-[#cfd3e1]">
                {pendingRequests.length}
              </span>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#2d313a] bg-[#111219]/80 px-6 py-12 text-center">
                <Inbox className="mx-auto size-10 text-[#3d4353]" />
                <p className="mt-4 text-base font-medium text-white">
                  Queue is clear
                </p>
                <p className="mt-2 text-sm text-[#6d7895]">
                  No pending requests are waiting for review right now.
                </p>
              </div>
            ) : (
              <ReviewQueueTable reviews={pendingRequests} mode="pending" />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
