"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SubmitReviewModal } from "@/components/elements/resume/SubmitReviewModal";
import {
  Loader2,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  FileText,
  ExternalLink,
  ClipboardCheck,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CareerTipOfDayCard } from "@/components/elements/dashboard/CareerTipOfDayCard";
import { useSessionStore } from "@/store/useSessionStore";
import { useSessionSync } from "@/lib/hooks/useSessionSync";
import {
  getUserResumes,
  deleteResume,
  type ResumeMetadata,
} from "@/lib/resumeService";
import {
  getStudentReviewRequests,
  type StudentReviewRequest,
} from "@/lib/review/getStudentReviewRequests";

// Sort configuration type
type SortColumn = "name" | "template_type" | "updated_at";
type SortDirection = "asc" | "desc";

interface SortConfig {
  column: SortColumn;
  direction: SortDirection;
}

/**
 * Format a date string to a readable format
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
}

/**
 * Format template type to display name
 */
function formatTemplateType(templateType: string | null): string {
  if (!templateType) return "Custom";
  return templateType
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Skeleton loader for table rows
 */
const TableRowSkeleton: React.FC = () => (
  <tr className="border-b border-[#2d313a]/50">
    <td className="px-4 py-3">
      <Skeleton className="h-5 w-40 bg-[#2d313a]" />
    </td>
    <td className="px-4 py-3">
      <Skeleton className="h-5 w-24 bg-[#2d313a]" />
    </td>
    <td className="px-4 py-3">
      <Skeleton className="h-5 w-20 bg-[#2d313a]" />
    </td>
    <td className="px-4 py-3">
      <Skeleton className="h-8 w-16 bg-[#2d313a]" />
    </td>
  </tr>
);

/**
 * Skeleton loader for review table rows
 */
const ReviewTableRowSkeleton: React.FC = () => (
  <tr className="border-b border-[#2d313a]/50">
    <td className="px-4 py-3">
      <Skeleton className="h-5 w-32 bg-[#2d313a]" />
    </td>
    <td className="px-4 py-3">
      <Skeleton className="h-6 w-24 rounded-full bg-[#2d313a]" />
    </td>
    <td className="px-4 py-3">
      <Skeleton className="h-5 w-20 bg-[#2d313a]" />
    </td>
    <td className="px-4 py-3">
      <Skeleton className="h-5 w-20 bg-[#2d313a]" />
    </td>
  </tr>
);

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: {
    label: "Pending Review",
    color: "border border-[#f59e0b]/30 bg-[#f59e0b]/12 text-[#f5c76b]",
  },
  accepted: {
    label: "In Review",
    color: "border border-[#274cbc]/40 bg-[#274cbc]/15 text-[#8fa5ff]",
  },
  completed: {
    label: "Completed",
    color: "border border-[#58f5c3]/30 bg-[#58f5c3]/12 text-[#58f5c3]",
  },
};

/**
 * Sortable column header component
 */
interface SortableHeaderProps {
  label: string;
  column: SortColumn;
  sortConfig: SortConfig;
  onSort: (column: SortColumn) => void;
  className?: string;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  label,
  column,
  sortConfig,
  onSort,
  className = "",
}) => {
  const isActive = sortConfig.column === column;

  return (
    <th
      className={`px-4 py-3 text-left text-xs font-medium text-[#6d7895] uppercase tracking-wider cursor-pointer hover:text-white transition-colors select-none ${className}`}
      onClick={() => onSort(column)}
    >
      <div className="flex items-center gap-1">
        {label}
        <span className="flex flex-col">
          <ChevronUp
            className={`w-3 h-3 -mb-1 ${
              isActive && sortConfig.direction === "asc"
                ? "text-white"
                : "text-[#3d4353]"
            }`}
          />
          <ChevronDown
            className={`w-3 h-3 ${
              isActive && sortConfig.direction === "desc"
                ? "text-white"
                : "text-[#3d4353]"
            }`}
          />
        </span>
      </div>
    </th>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useSessionStore();
  const prefersReducedMotion = useReducedMotion();

  // Resume list state
  const [resumes, setResumes] = useState<ResumeMetadata[]>([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Sort state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: "updated_at",
    direction: "desc",
  });

  const [showSubmitReviewModal, setShowSubmitReviewModal] = useState(false);

  // Review list state
  const [reviews, setReviews] = useState<StudentReviewRequest[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [loadReviewsError, setLoadReviewsError] = useState<string | null>(null);

  // Sync session store with Supabase
  useSessionSync();

  // Fetch user's resumes on mount
  useEffect(() => {
    async function fetchResumes() {
      if (!user?.id) return;

      setIsLoadingResumes(true);
      setLoadError(null);

      try {
        const userResumes = await getUserResumes(user.id);
        setResumes(userResumes);
      } catch (error) {
        console.error("Failed to fetch resumes:", error);
        setLoadError(
          error instanceof Error ? error.message : "Failed to load resumes",
        );
      } finally {
        setIsLoadingResumes(false);
      }
    }

    fetchResumes();
  }, [user?.id]);

  // Fetch user's review requests on mount and refetch helper
  const fetchReviews = useCallback(async () => {
    if (!user?.id) return;
    setIsLoadingReviews(true);
    setLoadReviewsError(null);
    try {
      const userReviews = await getStudentReviewRequests(user.id);
      setReviews(userReviews);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setLoadReviewsError(
        error instanceof Error ? error.message : "Failed to load reviews",
      );
    } finally {
      setIsLoadingReviews(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Sort resumes based on current sort config
  const sortedResumes = useMemo(() => {
    const sorted = [...resumes].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortConfig.column) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "template_type":
          aValue = (a.template_type || "custom").toLowerCase();
          bValue = (b.template_type || "custom").toLowerCase();
          break;
        case "updated_at":
          aValue = new Date(a.updated_at).getTime();
          bValue = new Date(b.updated_at).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [resumes, sortConfig]);

  // Handle column sort
  const handleSort = (column: SortColumn) => {
    setSortConfig((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Handle delete resume
  const handleDeleteResume = async (e: React.MouseEvent, resumeId: string) => {
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this resume?")) {
      return;
    }

    setDeletingId(resumeId);

    try {
      await deleteResume(resumeId);
      setResumes((prev) => prev.filter((r) => r.id !== resumeId));
    } catch (error) {
      console.error("Failed to delete resume:", error);
      alert("Failed to delete resume. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // Navigate to resume builder
  const handleRowClick = (resumeId: string) => {
    router.push(`/builder?id=${resumeId}`);
  };

  // Get user display name
  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";
  const welcomeHeadline =
    resumes.length === 0
      ? "Ready to build your first standout resume?"
      : "Ready for your next revision sprint?";

  const activeReviewCount = useMemo(
    () =>
      reviews.filter(
        (request) =>
          request.status === "pending" || request.status === "accepted",
      ).length,
    [reviews],
  );

  const completedReviewCount = useMemo(
    () => reviews.filter((request) => request.status === "completed").length,
    [reviews],
  );

  return (
    <div className="relative w-full overflow-hidden px-4 pb-10 pt-8 sm:px-6 md:px-8 md:pt-10 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-[18%] h-72 w-72 rounded-full bg-[#274cbc]/12 blur-[130px]" />
        <div className="absolute top-40 right-[5%] h-64 w-64 rounded-full bg-[#19c8ff]/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.9)_1px,transparent_1px)] bg-size-[110px_110px] opacity-[0.05]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-310 flex-col gap-6 md:gap-7">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative overflow-hidden rounded-4xl border border-[#2b3242] bg-[radial-gradient(circle_at_top_right,rgba(39,76,188,0.24),transparent_48%),linear-gradient(145deg,rgba(17,20,30,0.95),rgba(10,12,18,0.95))] px-5 py-6 shadow-[0_28px_60px_rgba(1,2,7,0.45)] sm:px-7 sm:py-7"
        >
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -right-14 top-1 h-40 w-40 rounded-full border border-[#4b62ad]/35"
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.06, 1],
                  }
            }
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#89a5ff]">
                Dashboard
              </p>
              <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                Welcome back, {displayName}.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#cfd3e1] sm:text-base">
                {welcomeHeadline} Track your progress, launch new work quickly,
                and keep your review workflow moving in one place.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3">
                <Link href="/templates">
                  <Button className="h-10 rounded-full bg-[#274cbc] px-5 text-sm font-semibold text-white hover:bg-[#315be1]">
                    <Plus className="mr-1.5 h-4 w-4" />
                    New Resume
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setShowSubmitReviewModal(true)}
                  className="h-10 rounded-full border-[#2f3d64] bg-[#121722]/80 px-5 text-sm font-semibold text-[#d5dcf4] hover:border-[#4c5f94] hover:bg-[#171f2f] hover:text-white"
                >
                  <ClipboardCheck className="mr-1.5 h-4 w-4" />
                  New Review
                </Button>
                <Link
                  href="/features"
                  className="inline-flex h-10 items-center rounded-full border border-[#2b3242] bg-[#10131b]/65 px-4 text-sm font-medium text-[#cfd3e1] transition-colors hover:border-[#3d4353] hover:text-white"
                >
                  Explore Features
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:self-start">
              <CareerTipOfDayCard userKey={user?.id ?? "guest"} />
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          <div className="rounded-2xl border border-[#2b3242] bg-[#111319]/82 px-4 py-4 shadow-[0_15px_35px_rgba(1,2,7,0.3)]">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#89a5ff]">
              <FileText className="h-4 w-4" />
              Resume progress
            </div>
            <p className="mt-3 text-3xl font-semibold text-white">
              {resumes.length}
            </p>
            <p className="mt-1 text-sm text-[#6d7895]">
              {resumes.length === 1
                ? "Resume in your workspace"
                : "Resumes in your workspace"}
            </p>
          </div>

          <div className="rounded-2xl border border-[#2b3242] bg-[#111319]/82 px-4 py-4 shadow-[0_15px_35px_rgba(1,2,7,0.3)]">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#89a5ff]">
              <Clock3 className="h-4 w-4" />
              Active reviews
            </div>
            <p className="mt-3 text-3xl font-semibold text-white">
              {activeReviewCount}
            </p>
            <p className="mt-1 text-sm text-[#6d7895]">
              Pending or currently in review
            </p>
          </div>

          <div className="rounded-2xl border border-[#2b3242] bg-[#111319]/82 px-4 py-4 shadow-[0_15px_35px_rgba(1,2,7,0.3)] sm:col-span-2 xl:col-span-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#89a5ff]">
              <CheckCircle2 className="h-4 w-4" />
              Completed reviews
            </div>
            <p className="mt-3 text-3xl font-semibold text-white">
              {completedReviewCount}
            </p>
            <p className="mt-1 text-sm text-[#6d7895]">
              Feedback received and ready to apply
            </p>
          </div>
        </motion.section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="rounded-[1.65rem] border border-[#2b3242] bg-[#10131a]/84 shadow-[0_24px_45px_rgba(2,4,10,0.34)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2b3242] px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-semibold text-[#f4f6ff]">
                  Your resumes
                </h2>
                <p className="mt-1 text-sm text-[#6d7895]">
                  Open any resume to continue editing.
                </p>
              </div>
              <Link href="/templates">
                <Button className="h-9 rounded-full bg-[#274cbc] px-4 text-sm font-semibold text-white hover:bg-[#315be1]">
                  <Plus className="mr-1.5 h-4 w-4" />
                  New Resume
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-162.5 w-full">
                <thead className="border-b border-[#2d313a] bg-[#141822]/80">
                  <tr>
                    <SortableHeader
                      label="Name"
                      column="name"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      className="w-auto"
                    />
                    <SortableHeader
                      label="Template"
                      column="template_type"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      className="w-40"
                    />
                    <SortableHeader
                      label="Last Updated"
                      column="updated_at"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      className="w-40"
                    />
                    <th className="w-23 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6d7895]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingResumes && (
                    <>
                      <TableRowSkeleton />
                      <TableRowSkeleton />
                      <TableRowSkeleton />
                    </>
                  )}

                  {loadError && !isLoadingResumes && (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center">
                        <p className="mb-2 text-red-400">{loadError}</p>
                        <Button
                          variant="ghost"
                          onClick={() => window.location.reload()}
                          className="text-sm text-[#6d7895] hover:text-white"
                        >
                          Try Again
                        </Button>
                      </td>
                    </tr>
                  )}

                  {!isLoadingResumes && !loadError && resumes.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-16 text-center">
                        <FileText className="mx-auto mb-3 h-10 w-10 text-[#3d4353]" />
                        <p className="mb-4 text-[#6d7895]">No resumes yet</p>
                        <Link href="/templates">
                          <Button className="h-9 rounded-lg bg-[#274cbc] px-4 text-sm text-white hover:bg-[#315be1]">
                            <Plus className="mr-2 h-4 w-4" />
                            Create your first resume
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )}

                  {!isLoadingResumes &&
                    !loadError &&
                    sortedResumes.map((resume) => (
                      <tr
                        key={resume.id}
                        onClick={() => handleRowClick(resume.id)}
                        className="group cursor-pointer border-b border-[#2d313a]/50 transition-colors hover:bg-[#1a1c22]/50"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1f2330]/80 text-[#6d7895] transition-colors group-hover:text-[#8fa5ff]">
                              <FileText className="h-4 w-4" />
                            </div>
                            <span className="max-w-[320px] truncate text-sm font-medium text-white">
                              {resume.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-[#a4a7b5]">
                            {formatTemplateType(resume.template_type)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-[#6d7895]">
                            {formatDate(resume.updated_at)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/builder?id=${resume.id}`);
                              }}
                              className="h-8 w-8 text-[#6d7895] hover:bg-[#2d313a]/50 hover:text-white"
                              aria-label="Edit resume"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => handleDeleteResume(e, resume.id)}
                              disabled={deletingId === resume.id}
                              className="h-8 w-8 text-[#6d7895] hover:bg-red-400/10 hover:text-red-400"
                              aria-label="Delete resume"
                            >
                              {deletingId === resume.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {!isLoadingResumes && !loadError && resumes.length > 0 && (
              <p className="px-5 py-3 text-xs text-[#6d7895] sm:px-6">
                {resumes.length} resume{resumes.length !== 1 ? "s" : ""}
              </p>
            )}
          </motion.section>

          <div className="flex flex-col gap-6">
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12, ease: "easeOut" }}
              className="relative overflow-hidden rounded-3xl border border-[#2b3242] bg-[radial-gradient(circle_at_top_right,rgba(39,76,188,0.2),transparent_55%),linear-gradient(160deg,rgba(16,19,30,0.93),rgba(11,13,20,0.92))] px-5 py-5"
            >
              <motion.div
                aria-hidden="true"
                className="absolute right-2 top-0 h-20 w-20 rounded-full bg-[#315be1]/20 blur-2xl"
                animate={
                  prefersReducedMotion
                    ? undefined
                    : {
                        opacity: [0.35, 0.75, 0.35],
                        y: [0, 7, 0],
                      }
                }
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div className="relative">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#89a5ff]">
                  <Sparkles className="h-4 w-4" />
                  Builder Guidance
                </div>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  Keep your momentum high
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-[#cfd3e1]">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#58f5c3]" />
                    Add quantified outcomes to your top project bullets.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#58f5c3]" />
                    Prioritize one resume version for each role type.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#58f5c3]" />
                    Request a review before major application deadlines.
                  </li>
                </ul>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14, ease: "easeOut" }}
              className="rounded-[1.65rem] border border-[#2b3242] bg-[#10131a]/84 shadow-[0_24px_45px_rgba(2,4,10,0.34)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#2b3242] px-5 py-4 sm:px-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#f4f6ff]">
                    Resume reviews
                  </h2>
                  <p className="mt-1 text-sm text-[#6d7895]">
                    Submit a PDF and track feedback status.
                  </p>
                </div>
                <Button
                  onClick={() => setShowSubmitReviewModal(true)}
                  className="h-9 rounded-full bg-[#274cbc] px-4 text-sm font-semibold text-white hover:bg-[#315be1]"
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  New Review
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead className="border-b border-[#2d313a] bg-[#141822]/80">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6d7895]">
                        Name
                      </th>
                      <th className="w-37.5 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6d7895]">
                        Status
                      </th>
                      <th className="w-30 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6d7895]">
                        Submitted
                      </th>
                      <th className="w-25 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6d7895]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingReviews && (
                      <>
                        <ReviewTableRowSkeleton />
                        <ReviewTableRowSkeleton />
                        <ReviewTableRowSkeleton />
                      </>
                    )}

                    {loadReviewsError && !isLoadingReviews && (
                      <tr>
                        <td colSpan={4} className="px-4 py-12 text-center">
                          <p className="mb-2 text-red-400">
                            {loadReviewsError}
                          </p>
                          <Button
                            variant="ghost"
                            onClick={() => fetchReviews()}
                            className="text-sm text-[#6d7895] hover:text-white"
                          >
                            Try Again
                          </Button>
                        </td>
                      </tr>
                    )}

                    {!isLoadingReviews &&
                      !loadReviewsError &&
                      reviews.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-16 text-center">
                            <div className="mx-auto flex max-w-md flex-col items-center justify-center text-center">
                              <ClipboardCheck className="mb-3 h-10 w-10 text-[#3d4353]" />
                              <p className="font-medium text-white">
                                No reviews yet
                              </p>
                              <p className="mt-2 text-sm text-[#6d7895]">
                                Submit a resume when you want reviewer feedback.
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}

                    {!isLoadingReviews &&
                      !loadReviewsError &&
                      reviews.map((request) => {
                        const version = Array.isArray(request.resume_versions)
                          ? request.resume_versions[0]
                          : request.resume_versions;
                        const reviewDisplayName =
                          version?.label ?? version?.file_name ?? "Untitled";
                        const statusConfig =
                          statusLabels[request.status] ?? statusLabels.pending;

                        return (
                          <tr
                            key={request.id}
                            className={`group border-b border-[#2d313a]/50 transition-colors ${
                              request.status === "completed"
                                ? "cursor-pointer hover:bg-[#1a1c22]/50"
                                : ""
                            }`}
                            onClick={
                              request.status === "completed"
                                ? () => router.push(`/review/${request.id}`)
                                : undefined
                            }
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1f2330]/80 text-[#6d7895] transition-colors group-hover:text-[#8fa5ff]">
                                  <ClipboardCheck className="h-4 w-4" />
                                </div>
                                <span className="max-w-55 truncate text-sm font-medium text-white">
                                  {reviewDisplayName}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex whitespace-nowrap rounded-full px-2 py-1 text-xs font-semibold ${statusConfig.color}`}
                              >
                                {statusConfig.label}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-[#6d7895]">
                                {formatDate(request.created_at)}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {request.status === "completed" ? (
                                <a
                                  href={`/review/${request.id}`}
                                  className="text-sm font-medium text-[#89a5ff] hover:text-white hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  View Feedback
                                </a>
                              ) : (
                                <span className="text-sm text-[#4d5363]">
                                  —
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {!isLoadingReviews && !loadReviewsError && reviews.length > 0 && (
                <p className="px-5 py-3 text-xs text-[#6d7895] sm:px-6">
                  {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                </p>
              )}
            </motion.section>
          </div>
        </div>
      </div>

      {showSubmitReviewModal && (
        <SubmitReviewModal
          onClose={() => setShowSubmitReviewModal(false)}
          onSubmitted={() => {
            setShowSubmitReviewModal(false);
            fetchReviews();
          }}
        />
      )}
    </div>
  );
}
