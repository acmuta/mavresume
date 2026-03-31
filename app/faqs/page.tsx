"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  HelpCircle,
  Menu,
  RotateCcw,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { allFaqs, builderFaqs, reviewFaqs, type FAQItem } from "@/data/faqs";

function filterFaqs(items: FAQItem[], query: string): FAQItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;

  return items.filter((faq) => {
    const haystack = [faq.question, faq.answer, ...faq.keywords]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

function FAQGroup({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: FAQItem[];
}) {
  return (
    <section className="py-2">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {title}
          </h2>
          <p className="mt-1.5 text-sm text-[#a4a7b5]">{description}</p>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#89a5ff]">
          {items.length} item{items.length === 1 ? "" : "s"}
        </span>
      </div>

      {items.length > 0 ? (
        <Accordion type="single" collapsible className="gap-3">
          {items.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-base font-semibold text-white sm:text-[1.02rem]">
                <span className="pr-3">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-[#cfd3e1] sm:text-[0.95rem]">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="px-1 py-6 text-sm text-[#6d7895]">
          No results in this section.
        </div>
      )}
    </section>
  );
}

function BackgroundAtmosphere() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,_#12141b_0%,_#0d0e12_45%,_#09090b_100%)]" />
      <div className="absolute left-1/2 top-0 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-[#274cbc]/10 blur-[180px]" />
      <div className="absolute right-0 top-[18rem] h-80 w-80 rounded-full bg-[#19c8ff]/8 blur-[160px]" />
      <div className="absolute left-0 top-[34rem] h-72 w-72 rounded-full bg-[#274cbc]/8 blur-[160px]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:120px_120px]" />
    </>
  );
}

export default function FAQsPage() {
  const [query, setQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const filteredBuilderFaqs = useMemo(
    () => filterFaqs(builderFaqs, query),
    [query],
  );
  const filteredReviewFaqs = useMemo(
    () => filterFaqs(reviewFaqs, query),
    [query],
  );

  const totalMatches = filteredBuilderFaqs.length + filteredReviewFaqs.length;
  const hasQuery = query.trim().length > 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#101113] text-white">
      <BackgroundAtmosphere />

      <section className="relative px-4 pb-8 pt-5 sm:px-6 sm:pt-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <Link
                href="/"
                className="font-bold tracking-tight text-3xl sm:text-4xl [mask-image:linear-gradient(to_bottom,black_40%,transparent)] [mask-repeat:no-repeat] [mask-size:100%_100%]"
              >
                MAV<span className="font-extralight">RESUME</span>
              </Link>
              <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-[#6d7895] sm:text-xs">
                Frequently asked questions
              </p>
            </div>

            <div className="relative">
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => setMobileNavOpen((prev) => !prev)}
                aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileNavOpen}
                className="h-10 w-10 rounded-full border-[#2b3242] bg-[#10121a]/75 text-[#cfd3e1] hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white md:hidden"
              >
                {mobileNavOpen ? <X className="size-4" /> : <Menu className="size-4" />}
              </Button>

              {mobileNavOpen && (
                <div className="absolute right-0 top-full z-40 mt-3 w-[min(85vw,17rem)] rounded-2xl border border-[#2b3242] bg-[#10121a]/95 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-md md:hidden">
                  <Link
                    href="/"
                    onClick={() => setMobileNavOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-[#cfd3e1] transition-colors hover:bg-[#161b25] hover:text-white"
                  >
                    Home
                  </Link>
                  <Link
                    href="/features"
                    onClick={() => setMobileNavOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-[#cfd3e1] transition-colors hover:bg-[#161b25] hover:text-white"
                  >
                    Features
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileNavOpen(false)}
                    className="mt-1 flex items-center justify-between rounded-xl bg-[#274cbc]/18 px-3 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-[#cfd3e1] transition-colors hover:bg-[#274cbc]/28 hover:text-white"
                  >
                    <span>Login</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              )}

              <div className="hidden items-center gap-2 sm:gap-3 md:flex">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="group/nav rounded-full border-transparent bg-transparent px-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#cfd3e1] hover:bg-transparent hover:text-white"
              >
                <Link href="/">
                  <span className="relative inline-block after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#89a5ff] after:transition-transform after:duration-300 group-hover/nav:after:scale-x-100">
                    Home
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="group/nav rounded-full border-transparent bg-transparent px-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#cfd3e1] hover:bg-transparent hover:text-white"
              >
                <Link href="/features">
                  <span className="relative inline-block after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#89a5ff] after:transition-transform after:duration-300 group-hover/nav:after:scale-x-100">
                    Features
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="group/nav rounded-full border-transparent bg-transparent px-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#cfd3e1] hover:bg-transparent hover:text-white"
              >
                <Link href="/login">
                  <span className="relative inline-block after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#89a5ff] after:transition-transform after:duration-300 group-hover/nav:after:scale-x-100">
                    Login
                  </span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative py-4"
          >
            <div className="relative max-w-5xl">
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#89a5ff]">
                <HelpCircle className="size-3.5" />
                FAQ Library
              </div>

              <h1 className="mt-5 text-4xl font-semibold leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Answers for builder
                <br />
                and review workflows.
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#cfd3e1] sm:text-base">
                Search across all {allFaqs.length} FAQs, then expand the items
                you need. Questions are grouped by Resume Builder and Resume Review
                so you can find guidance quickly.
              </p>

              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative w-full max-w-2xl">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6d7895]" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search FAQs (e.g., autosave, annotations, submit review)"
                    className="h-11 border-[#2d313a] bg-[#1a1c22]/55 pl-9 text-white placeholder:text-[#6d7895] focus-visible:border-[#3d4353]"
                    aria-label="Search FAQs"
                  />
                </div>

                {hasQuery && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setQuery("")}
                    className="h-11 rounded-full border-[#2b3242] bg-[#10121a]/70 px-4 text-sm font-semibold text-[#cfd3e1] hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
                  >
                    <RotateCcw className="mr-1.5 size-4" />
                    Clear
                  </Button>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[#6d7895]">
                <span>{totalMatches} match{totalMatches === 1 ? "" : "es"}</span>
                <span className="h-1 w-1 rounded-full bg-[#3d4353]" />
                <span>{filteredBuilderFaqs.length} builder</span>
                <span className="h-1 w-1 rounded-full bg-[#3d4353]" />
                <span>{filteredReviewFaqs.length} review</span>
              </div>
            </div>
          </motion.div>

          <div className="mt-8 grid gap-10">
            {totalMatches === 0 ? (
              <div className="py-14 text-center">
                <Sparkles className="mx-auto size-5 text-[#89a5ff]" />
                <p className="mt-4 text-lg font-semibold text-white">No FAQ matches your search</p>
                <p className="mt-2 text-sm text-[#6d7895]">
                  Try different keywords or clear search to view all FAQs.
                </p>
                <Button
                  type="button"
                  onClick={() => setQuery("")}
                  className="mt-5 h-10 rounded-full bg-[#274cbc] px-5 text-sm font-semibold text-white hover:bg-[#315be1]"
                >
                  <RotateCcw className="mr-1.5 size-4" />
                  Show all FAQs
                </Button>
              </div>
            ) : (
              <>
                <FAQGroup
                  title="Resume Builder FAQs"
                  description="Questions about templates, editing, sections, formatting, and AI refinement."
                  items={filteredBuilderFaqs}
                />

                <FAQGroup
                  title="Resume Review FAQs"
                  description="Questions about submissions, queue flow, annotations, and completion feedback."
                  items={filteredReviewFaqs}
                />
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
