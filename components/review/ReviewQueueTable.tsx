"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Clock3,
  FileText,
  Loader2,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { claimReview } from "@/lib/actions/reviews";
import type { ReviewRequestWithVersion } from "@/lib/reviewer/getReviewerDashboardData";

type Props = {
  reviews: ReviewRequestWithVersion[];
  mode: "pending" | "active";
};

const priorityColors: Record<string, string> = {
  low: "border-[#3d4353] bg-[#1a1d24] text-[#cfd3e1]",
  normal: "border-[#274cbc]/40 bg-[#274cbc]/15 text-[#8fa5ff]",
  high: "border-[#f59e0b]/35 bg-[#f59e0b]/12 text-[#f5c76b]",
};

function formatDate(dateString: string | null) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString();
}

function ReviewQueueMobileCard({
  review,
  mode,
  onAccept,
  claiming,
  claimed,
  error,
}: {
  review: ReviewRequestWithVersion;
  mode: "pending" | "active";
  onAccept: (reviewId: string) => Promise<void>;
  claiming: boolean;
  claimed: boolean;
  error: string | null;
}) {
  const router = useRouter();

  const profile = Array.isArray(review.user_profiles)
    ? review.user_profiles[0]
    : review.user_profiles;
  const version = Array.isArray(review.resume_versions)
    ? review.resume_versions[0]
    : review.resume_versions;
  const studentName = profile?.full_name ?? profile?.email ?? "Unknown student";
  const resumeLabel = version?.label ?? version?.file_name ?? "Untitled resume";

  return (
    <article className="rounded-2xl border border-dashed border-[#2d313a] bg-[#111219]/85 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm text-[#89a5ff]">
            <UserRound className="size-4 shrink-0" />
            <span className="truncate font-medium">{studentName}</span>
          </div>
          <div className="mt-3 flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#1f2330]/80 text-[#8fa5ff]">
              <FileText className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-white">
                {resumeLabel}
              </p>
              <p className="mt-1 text-sm text-[#6d7895]">
                {mode === "active"
                  ? "Continue review from your queue."
                  : "Available to claim."}
              </p>
            </div>
          </div>
        </div>

        <span
          className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${priorityColors[review.priority] ?? priorityColors.normal}`}
        >
          {review.priority}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#a4a7b5]">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2b3242] bg-[#10121a] px-3 py-1">
          <Clock3 className="size-3.5" />
          Submitted {formatDate(review.created_at)}
        </span>
        {mode === "active" && review.claimed_at && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2b3242] bg-[#10121a] px-3 py-1">
            Claimed {formatDate(review.claimed_at)}
          </span>
        )}
      </div>

      {review.student_notes && (
        <div className="mt-4 rounded-2xl border border-dashed border-[#2d313a] bg-[#15171c]/70 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#6d7895]">
            Student Notes
          </p>
          <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-[#cfd3e1]">
            {review.student_notes}
          </p>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <div className="mt-4 border-t border-[#20242d] pt-4">
        {mode === "pending" && !claimed ? (
          <Button
            onClick={() => onAccept(review.id)}
            disabled={claiming}
            className="h-11 w-full rounded-xl bg-[#274cbc] text-sm font-semibold text-white hover:bg-[#315be1]"
          >
            {claiming ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Accepting...
              </>
            ) : (
              <>
                Accept Review
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={() => router.push(`/review/${review.id}`)}
            className="h-11 w-full rounded-xl bg-[#274cbc] text-sm font-semibold text-white hover:bg-[#315be1]"
          >
            Start Review
            <ArrowRight className="size-4" />
          </Button>
        )}
      </div>
    </article>
  );
}

export default function ReviewQueueTable({ reviews, mode }: Props) {
  const router = useRouter();
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [claimedIds, setClaimedIds] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  async function handleAccept(reviewId: string) {
    setClaimingId(reviewId);
    setErrors((prev) => ({ ...prev, [reviewId]: null }));

    const { error } = await claimReview(reviewId);
    if (error) {
      setErrors((prev) => ({ ...prev, [reviewId]: error }));
      setClaimingId(null);
      return;
    }

    setClaimedIds((prev) => ({ ...prev, [reviewId]: true }));
    setClaimingId(null);
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-[#2d313a] bg-[#111219]/80 md:block">
        <table className="w-full table-fixed">
          <thead className="border-b border-[#2d313a] bg-[#0f1117]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.2em] text-[#6d7895]">
                Student
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.2em] text-[#6d7895]">
                Resume
              </th>
              <th className="w-[140px] px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.2em] text-[#6d7895]">
                Priority
              </th>
              <th className="w-[140px] px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.2em] text-[#6d7895]">
                {mode === "active" ? "Claimed" : "Submitted"}
              </th>
              <th className="w-[260px] px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.2em] text-[#6d7895]">
                Notes
              </th>
              <th className="w-[200px] px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.2em] text-[#6d7895]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => {
              const profile = Array.isArray(review.user_profiles)
                ? review.user_profiles[0]
                : review.user_profiles;
              const version = Array.isArray(review.resume_versions)
                ? review.resume_versions[0]
                : review.resume_versions;
              const studentName =
                profile?.full_name ?? profile?.email ?? "Unknown student";
              const resumeLabel =
                version?.label ?? version?.file_name ?? "Untitled resume";
              const rowError = errors[review.id];
              const claimed = claimedIds[review.id];

              return (
                <tr
                  key={review.id}
                  className="border-b border-[#20242d] align-top last:border-b-0 hover:bg-[#15171c]/60"
                >
                  <td className="px-4 py-4">
                    <div className="flex min-w-0 items-center gap-2 text-sm text-[#89a5ff]">
                      <UserRound className="size-4 shrink-0" />
                      <span className="truncate font-medium">{studentName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#1f2330]/80 text-[#8fa5ff]">
                        <FileText className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {resumeLabel}
                        </p>
                        <p className="mt-1 text-xs text-[#6d7895]">
                          {mode === "active"
                            ? "Continue review from your queue."
                            : "Available to claim."}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${priorityColors[review.priority] ?? priorityColors.normal}`}
                    >
                      {review.priority}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-[#cfd3e1]">
                    {formatDate(
                      mode === "active" ? review.claimed_at : review.created_at,
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {review.student_notes ? (
                      <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed text-[#cfd3e1]">
                        {review.student_notes}
                      </p>
                    ) : (
                      <span className="text-sm text-[#4d5363]">No notes</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2">
                      {mode === "pending" && !claimed ? (
                        <Button
                          onClick={() => handleAccept(review.id)}
                          disabled={claimingId === review.id}
                          className="h-10 w-full rounded-xl bg-[#274cbc] text-sm font-semibold text-white hover:bg-[#315be1]"
                        >
                          {claimingId === review.id ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              Accepting...
                            </>
                          ) : (
                            <>
                              Accept Review
                              <ArrowRight className="size-4" />
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => router.push(`/review/${review.id}`)}
                          className="h-10 w-full rounded-xl bg-[#274cbc] text-sm font-semibold text-white hover:bg-[#315be1]"
                        >
                          Start Review
                          <ArrowRight className="size-4" />
                        </Button>
                      )}
                      {rowError && (
                        <p className="text-xs leading-relaxed text-red-400">
                          {rowError}
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:hidden">
        {reviews.map((review) => (
          <ReviewQueueMobileCard
            key={review.id}
            review={review}
            mode={mode}
            onAccept={handleAccept}
            claiming={claimingId === review.id}
            claimed={Boolean(claimedIds[review.id])}
            error={errors[review.id] ?? null}
          />
        ))}
      </div>
    </>
  );
}
