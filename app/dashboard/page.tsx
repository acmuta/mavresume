"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  FileText,
  ExternalLink,
  ClipboardCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSessionStore } from "@/store/useSessionStore";
import { useSessionSync } from "@/lib/hooks/useSessionSync";
import {
  getUserResumes,
  deleteResume,
  type ResumeMetadata,
} from "@/lib/resumeService";

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
          error instanceof Error ? error.message : "Failed to load resumes"
        );
      } finally {
        setIsLoadingResumes(false);
      }
    }

    fetchResumes();
  }, [user?.id]);

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
  const handleDeleteResume = async (
    e: React.MouseEvent,
    resumeId: string
  ) => {
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
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

  return (
    <div className="px-6 py-10 md:px-10 md:py-16 w-full">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-white">
          Welcome back, {displayName}
        </h1>
        <p className="text-sm text-[#6d7895] mt-1">
          Manage your resumes and create new ones
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 lg:w-full">
          {/* Quick Actions */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-[#cfd3e1]">Your Resumes</h2>
            <Link href="/templates">
              <Button className="bg-[#274cbc] text-white hover:bg-[#315be1] rounded-lg h-9 px-4 text-sm">
                <Plus className="w-4 h-4 mr-2" />
                New Resume
              </Button>
            </Link>
          </div>

          {/* Resume Table */}
          <div className="rounded-xl border border-[#2d313a] bg-[#15171c]/60 overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#1a1c22]/80 border-b border-[#2d313a]">
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
                    className="w-[150px]"
                  />
                  <SortableHeader
                    label="Last Updated"
                    column="updated_at"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    className="w-[150px]"
                  />
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6d7895] uppercase tracking-wider w-[80px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Loading State */}
                {isLoadingResumes && (
                  <>
                    <TableRowSkeleton />
                    <TableRowSkeleton />
                    <TableRowSkeleton />
                  </>
                )}

                {/* Error State */}
                {loadError && !isLoadingResumes && (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center">
                      <p className="text-red-400 mb-2">{loadError}</p>
                      <Button
                        variant="ghost"
                        onClick={() => window.location.reload()}
                        className="text-[#6d7895] hover:text-white text-sm"
                      >
                        Try Again
                      </Button>
                    </td>
                  </tr>
                )}

                {/* Empty State */}
                {!isLoadingResumes && !loadError && resumes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-16 text-center">
                      <FileText className="mx-auto w-10 h-10 text-[#3d4353] mb-3" />
                      <p className="text-[#6d7895] mb-4">No resumes yet</p>
                      <Link href="/templates">
                        <Button className="bg-[#274cbc] text-white hover:bg-[#315be1] rounded-lg h-9 px-4 text-sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Create your first resume
                        </Button>
                      </Link>
                    </td>
                  </tr>
                )}

                {/* Resume Rows */}
                {!isLoadingResumes &&
                  !loadError &&
                  sortedResumes.map((resume) => (
                    <tr
                      key={resume.id}
                      onClick={() => handleRowClick(resume.id)}
                      className="border-b border-[#2d313a]/50 hover:bg-[#1a1c22]/50 cursor-pointer transition-colors group"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex w-8 h-8 items-center justify-center rounded-lg bg-[#1f2330]/80 text-[#6d7895] group-hover:text-[#8fa5ff] transition-colors">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium text-white truncate max-w-[300px]">
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
                            className="h-8 w-8 text-[#6d7895] hover:text-white hover:bg-[#2d313a]/50"
                            aria-label="Edit resume"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleDeleteResume(e, resume.id)}
                            disabled={deletingId === resume.id}
                            className="h-8 w-8 text-[#6d7895] hover:text-red-400 hover:bg-red-400/10"
                            aria-label="Delete resume"
                          >
                            {deletingId === resume.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Resume count */}
          {!isLoadingResumes && !loadError && resumes.length > 0 && (
            <p className="text-xs text-[#6d7895] mt-3">
              {resumes.length} resume{resumes.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Right Column - Resume Reviews (Under Development) */}
        <div className="lg:w-1/3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-[#cfd3e1]">Resume Reviews</h2>
            <span className="inline-flex items-center rounded-md border border-[#2d313a] bg-[#1a1c22]/50 px-2.5 py-0.5 text-xs font-medium text-[#6d7895]">
              Under Development
            </span>
          </div>

          {/* Under Development Card */}
          <div className="rounded-xl border border-dashed border-[#2d313a] bg-[#15171c]/60 p-6 opacity-60 cursor-not-allowed">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex w-12 h-12 items-center justify-center rounded-xl bg-[#1f2330]/80 text-[#3d4353] mb-4">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-medium text-[#6d7895] mb-2">
                Resume Reviews Coming Soon
              </h3>
              <p className="text-xs text-[#4d5363] max-w-[200px]">
                Submit your resumes for expert feedback and track review status all in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
