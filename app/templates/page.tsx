"use client";

import React, { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  RotateCcw,
  X,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import {
  resumeTemplates,
  templateCategories,
  categoryDisplayNames,
  type CategoryKey,
} from "../../data/resume-templates";
import { TemplateCard } from "../../components/elements/templates/TemplateCard";
import { CreateResumeModal } from "../../components/elements/templates/CreateResumeModal";
import { HomeHeaderBar } from "../../components/elements/home/HomeHeaderBar";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";

export default function TemplatesPage() {
  const prefersReducedMotion = useReducedMotion();
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<CategoryKey[]>(
    Object.keys(templateCategories) as CategoryKey[],
  );
  const allCategories = Object.keys(templateCategories) as CategoryKey[];

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryKey, number> = {
      "tech-engineering": templateCategories["tech-engineering"].length,
      "business-analytics": templateCategories["business-analytics"].length,
      "design-media": templateCategories["design-media"].length,
      "health-service": templateCategories["health-service"].length,
    };
    return counts;
  }, []);

  // Filter templates based on search and categories
  const filteredTemplates = useMemo(() => {
    return resumeTemplates.filter((template) => {
      // Search filter (by name, case-insensitive)
      const matchesSearch =
        searchQuery === "" ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategories.some((category) =>
        templateCategories[category].includes(template.id as never),
      );

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategories]);

  // Handle category toggle
  const toggleCategory = (category: CategoryKey) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        // Remove category
        const newCategories = prev.filter((c) => c !== category);
        // If no categories selected, select all
        return newCategories.length === 0
          ? (Object.keys(templateCategories) as CategoryKey[])
          : newCategories;
      } else {
        // Add category
        return [...prev, category];
      }
    });
  };

  // Handle "All" toggle
  const toggleAll = () => {
    if (selectedCategories.length === allCategories.length) {
      // Deselect all (but keep at least one selected by selecting all again)
      setSelectedCategories(allCategories);
    } else {
      // Select all
      setSelectedCategories(allCategories);
    }
  };

  const allSelected =
    selectedCategories.length === Object.keys(templateCategories).length;
  const hasSearch = searchQuery.trim().length > 0;
  const hasFilterSelection = selectedCategories.length !== allCategories.length;

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories(allCategories);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#101113] text-white">
      <BackgroundAtmosphere />

      {/* Header Bar */}
      <div className="fixed top-0 left-0 z-50 w-full">
        <HomeHeaderBar />
      </div>

      <main className="relative z-10 px-4 pb-16 pt-30 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 sm:gap-12">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative isolate"
          >
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(330px,0.92fr)] lg:items-center">
              <div className="max-w-3xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#89a5ff]">
                  Template library
                </p>
                <h1 className="mt-4 text-4xl font-semibold leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Choose a major template
                  <br />
                  or design your own.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#cfd3e1] sm:text-base">
                  Start from a major-specific foundation or launch a fully
                  custom build flow, then refine and submit your final PDF for
                  review.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button
                    onClick={() => setIsCustomModalOpen(true)}
                    className="h-11 rounded-full bg-[#274cbc] px-5 text-sm font-semibold text-white hover:bg-[#315be1]"
                  >
                    Create custom template
                    <ArrowRight className="size-4" />
                  </Button>
                  <a
                    href="#major-templates"
                    className="inline-flex h-11 items-center rounded-full border border-[#2b3242] bg-[#111319]/70 px-5 text-sm font-medium text-[#cfd3e1] transition-colors hover:border-[#3d4353] hover:text-white"
                  >
                    Browse major templates
                  </a>
                </div>
              </div>

              <div className="relative">
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-2 rounded-[1.9rem] border border-[#274cbc]/25"
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : {
                          opacity: [0.35, 0.65, 0.35],
                          scale: [0.995, 1.005, 0.995],
                        }
                  }
                  transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <div className="relative overflow-hidden rounded-[1.75rem] border border-[#3659c4] bg-[radial-gradient(circle_at_top_right,rgba(39,76,188,0.3),transparent_52%),linear-gradient(150deg,rgba(16,20,31,0.95),rgba(10,12,18,0.95))] px-5 py-5 shadow-[0_25px_70px_rgba(2,4,10,0.5)] sm:px-6 sm:py-6">
                  <div className="pointer-events-none absolute inset-0 opacity-85">
                    <div className="absolute -right-8 top-1 h-24 w-24 rounded-full bg-[#274cbc]/28 blur-[55px]" />
                    <div className="absolute left-2 bottom-2 h-20 w-20 rounded-full bg-[#19c8ff]/12 blur-[45px]" />
                  </div>

                  <div className="relative">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#89a5ff]">
                      Create your own template
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-[1.65rem]">
                      Build your own custom path
                      
                    </h2>

                    <div className="mt-5 space-y-3.5">
                      {[
                        "Pick your own section structure",
                        "Adjust ordering as your draft evolves",
                        "Launch directly into the builder flow",
                      ].map((step) => (
                        <div key={step} className="flex items-start gap-2.5">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#58f5c3]" />
                          <p className="text-sm leading-relaxed text-[#d2d8ef]">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => setIsCustomModalOpen(true)}
                      className="mt-6 h-11 w-full rounded-xl bg-linear-to-r from-[#274cbc] to-[#315be1] text-sm font-semibold text-white hover:from-[#315be1] hover:to-[#3d6bff]"
                    >
                      Start custom template
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <section id="major-templates" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="rounded-3xl border border-[#2b3242] bg-[#111319]/72 px-4 py-4 shadow-[0_20px_45px_rgba(3,4,7,0.3)] backdrop-blur-md sm:px-5 sm:py-5"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#89a5ff]">
                    Premade catalog
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                    Major-specific templates
                  </h2>
                  <p className="mt-2 text-sm text-[#6d7895] sm:text-base">
                    Filter by category, search by major, and open a template in
                    one click.
                  </p>
                </div>

                <div className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-110">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6d7895]" />
                    <Input
                      type="text"
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-11 border-[#2d313a] bg-[#1a1c22]/50 pl-9 text-white placeholder:text-[#6d7895] focus-visible:border-[#3d4353]"
                      aria-label="Search template names"
                    />
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-11 border-[#2d313a] bg-[#1a1c22]/50 px-4 text-[#cfd3e1] hover:border-[#3d4353] hover:bg-[#1c1d21]/90 hover:text-white"
                      >
                        <SlidersHorizontal className="size-4" />
                        Categories
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-72 border-[#2d313a] bg-[#151618]/95 p-4 text-white backdrop-blur-lg"
                      align="end"
                    >
                      <div className="space-y-3">
                        <div className="mb-2 text-sm font-semibold text-white">
                          Filter by Category
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="all"
                            checked={allSelected}
                            onCheckedChange={toggleAll}
                            className="border-[#2d313a] data-[state=checked]:bg-[#274cbc] data-[state=checked]:border-[#274cbc]"
                          />
                          <label
                            htmlFor="all"
                            className="text-sm text-[#cfd3e1] cursor-pointer flex-1"
                          >
                            All
                          </label>
                        </div>
                        {(Object.keys(templateCategories) as CategoryKey[]).map(
                          (category) => (
                            <div
                              key={category}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={category}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={() => toggleCategory(category)}
                                className="border-[#2d313a] data-[state=checked]:bg-[#274cbc] data-[state=checked]:border-[#274cbc]"
                              />
                              <label
                                htmlFor={category}
                                className="text-sm text-[#cfd3e1] cursor-pointer flex-1"
                              >
                                {categoryDisplayNames[category]} (
                                {categoryCounts[category]})
                              </label>
                            </div>
                          ),
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {selectedCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#2d313a] bg-[#1a1c22]/65 px-3 py-1 text-xs font-medium text-[#cfd3e1] transition-colors hover:border-[#3d4353] hover:text-white"
                    aria-label={`Remove ${categoryDisplayNames[category]} filter`}
                  >
                    {categoryDisplayNames[category]} ({categoryCounts[category]}
                    )
                    <X className="size-3" />
                  </button>
                ))}

                {(hasSearch || hasFilterSelection) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-7 rounded-full border border-[#2b3242] bg-[#12151d] px-3 text-xs text-[#89a5ff] hover:bg-[#181c27] hover:text-white"
                  >
                    <RotateCcw className="size-3.5" />
                    Reset all
                  </Button>
                )}
              </div>
            </motion.div>

            {filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.24 }}
                    transition={{
                      duration: 0.45,
                      delay: prefersReducedMotion ? 0 : index * 0.05,
                      ease: "easeOut",
                    }}
                  >
                    <TemplateCard template={template} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-[#2b3242] bg-[#111319]/70 px-5 py-10 text-center"
              >
                <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-[#2b3242] bg-[#151923] text-[#89a5ff]">
                  <Sparkles className="size-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">
                  No matching templates found
                </h3>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[#6d7895] sm:text-base">
                  Try a broader search or reset category filters to see all
                  available templates.
                </p>
                <Button
                  onClick={clearAllFilters}
                  className="mt-6 rounded-full bg-[#274cbc] px-5 text-sm font-semibold text-white hover:bg-[#315be1]"
                >
                  Reset filters
                </Button>
              </motion.div>
            )}
          </section>
        </div>
      </main>

      <CreateResumeModal
        open={isCustomModalOpen}
        onOpenChange={setIsCustomModalOpen}
        templateType="custom"
        templateName="Custom Template"
      />
    </div>
  );
}

function BackgroundAtmosphere() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#12141b_0%,#0d0e12_45%,#09090b_100%)]" />
      <div className="absolute left-1/2 top-0 h-136 w-136 -translate-x-1/2 rounded-full bg-[#274cbc]/10 blur-[180px]" />
      <div className="absolute right-0 top-72 h-72 w-72 rounded-full bg-[#19c8ff]/8 blur-[160px]" />
      <div className="absolute left-0 top-128 h-64 w-64 rounded-full bg-[#274cbc]/8 blur-[150px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.9)_1px,transparent_1px)] bg-size-[120px_120px] opacity-[0.06]" />
    </>
  );
}
