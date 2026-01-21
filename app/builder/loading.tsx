export default function Loading() {
  return (
    <main className="relative z-10 py-5 text-white md:px-4 md:py-20 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        {/* Navigation bar */}
        <div
          className="flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-[#1b1d20] bg-[radial-gradient(circle_at_top,#1c2233,#101113_70%)] p-2 shadow-[0_25px_60px_rgba(3,4,7,0.55)] md:p-3"
          aria-hidden
        >
          <div className="h-5 w-24 rounded bg-white/5 animate-pulse" />
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="h-8 w-24 rounded-lg bg-white/5 animate-pulse md:w-28" />
                {i < 5 && (
                  <div className="h-4 w-4 shrink-0 rounded bg-white/5 animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form section */}
        <section
          className="relative overflow-hidden rounded-3xl border-2 border-dashed border-[#2c3037] bg-[radial-gradient(circle_at_top,_#1c2233,_#101113_70%)] p-8 shadow-[0_25px_60px_rgba(3,4,7,0.55)]"
          aria-hidden
        >
          <div className="relative space-y-6">
            <div className="h-6 w-40 rounded bg-white/5 animate-pulse" />
            <div className="h-4 w-full rounded bg-white/5 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-white/5 animate-pulse" />
            <div className="mt-8 rounded-2xl border-2 border-dashed border-[#2d323d] bg-[#1a1d24] p-4">
              <div className="h-4 w-28 rounded bg-white/5 animate-pulse" />
              <div className="mt-3 h-10 w-full rounded-lg bg-white/5 animate-pulse" />
              <div className="mt-2 h-10 w-full rounded-lg bg-white/5 animate-pulse" />
            </div>
            <div className="rounded-2xl border-2 border-dashed border-[#2d323d] bg-[#1a1d24] p-4">
              <div className="h-4 w-32 rounded bg-white/5 animate-pulse" />
              <div className="mt-3 h-10 w-full rounded-lg bg-white/5 animate-pulse" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
