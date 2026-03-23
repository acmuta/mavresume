import {
  CalendarRange,
  ClipboardList,
  FileText,
  MessageSquareText,
} from "lucide-react";

type Props = {
  priority: string;
  studentNotes: string | null;
  resumeLabel: string | null;
  fileName: string | null;
  submittedAt: string;
  claimedAt: string | null;
  completedAt: string | null;
  reviewerFeedback: string | null;
  viewerRole: "student" | "reviewer" | "admin";
};

const priorityColors: Record<string, string> = {
  low: "border-[#3d4353] bg-[#1a1d24] text-[#cfd3e1]",
  normal: "border-[#274cbc]/40 bg-[#274cbc]/15 text-[#8fa5ff]",
  high: "border-[#f59e0b]/35 bg-[#f59e0b]/12 text-[#f5c76b]",
};

function formatTimestamp(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleString();
}

export default function ReviewMetadata({
  priority,
  studentNotes,
  resumeLabel,
  fileName,
  submittedAt,
  claimedAt,
  completedAt,
  reviewerFeedback,
  viewerRole,
}: Props) {
  return (
    <section className="rounded-2xl border-2 border-dashed border-[#2d313a] bg-[#15171c]/80 p-6 shadow-[0_20px_60px_rgba(9,10,12,0.35)] backdrop-blur-md">
      <div className="mb-6 flex items-center gap-2">
        <ClipboardList className="size-5 text-[#89a5ff]" />
        <div>
          <h2 className="text-xl font-semibold text-white">Review Details</h2>
          <p className="mt-1 text-sm text-[#6d7895]">
            Submission context, timeline, and written feedback.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="rounded-2xl border border-dashed border-[#2d313a] bg-[#111219]/80 p-4">
          <div className="flex items-center gap-2 text-[#89a5ff]">
            <FileText className="size-4" />
            <p className="text-xs font-medium uppercase tracking-[0.2em]">
              Resume
            </p>
          </div>
          <p className="mt-3 text-sm font-medium text-white">
            {resumeLabel ?? fileName ?? "Untitled"}
          </p>
        </div>

        <div className="rounded-2xl border border-dashed border-[#2d313a] bg-[#111219]/80 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#6d7895]">
            Priority
          </p>
          <span
            className={`mt-3 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${priorityColors[priority] ?? priorityColors.normal}`}
          >
            {priority}
          </span>
        </div>

        <div className="rounded-2xl border border-dashed border-[#2d313a] bg-[#111219]/80 p-4">
          <div className="flex items-center gap-2 text-[#8fa5ff]">
            <CalendarRange className="size-4" />
            <p className="text-xs font-medium uppercase tracking-[0.2em]">
              Timeline
            </p>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-[#cfd3e1]">
            <li>
              <span className="text-[#6d7895]">Submitted:</span>{" "}
              {formatTimestamp(submittedAt)}
            </li>
            {claimedAt && (
              <li>
                <span className="text-[#6d7895]">Claimed:</span>{" "}
                {formatTimestamp(claimedAt)}
              </li>
            )}
            {completedAt && (
              <li>
                <span className="text-[#6d7895]">Completed:</span>{" "}
                {formatTimestamp(completedAt)}
              </li>
            )}
          </ul>
        </div>

        {studentNotes && (
          <div className="rounded-2xl border border-dashed border-[#2d313a] bg-[#111219]/80 p-4">
            <div className="flex items-center gap-2 text-[#89a5ff]">
              <MessageSquareText className="size-4" />
              <p className="text-xs font-medium uppercase tracking-[0.2em]">
                Student Notes
              </p>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#cfd3e1]">
              {studentNotes}
            </p>
          </div>
        )}

        {viewerRole === "student" && reviewerFeedback && (
          <div className="rounded-2xl border border-dashed border-[#274cbc]/40 bg-[#274cbc]/10 p-4">
            <div className="flex items-center gap-2 text-[#8fa5ff]">
              <MessageSquareText className="size-4" />
              <p className="text-xs font-medium uppercase tracking-[0.2em]">
                Reviewer Feedback
              </p>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#cfd3e1]">
              {reviewerFeedback}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
