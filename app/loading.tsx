export default function Loading() {
  return (
    <div className="relative min-h-screen bg-[#101113] text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-[#11131a] via-[#0d0e12] to-[#09090b]" />

      <main className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-16">
          {/* Hero */}
          <section
            className="relative overflow-hidden rounded-3xl border-2 border-dashed border-[#2c3037] bg-[radial-gradient(circle_at_top,_#1c2233,_#101113_70%)] p-8 shadow-[0_25px_60px_rgba(3,4,7,0.55)] sm:p-10"
            aria-hidden
          >
            <div className="relative flex flex-col gap-12 lg:flex-row">
              {/* Left: badge, h1, subhead, CTAs, Mission + Problem cards */}
              <div className="flex flex-1 flex-col gap-6">
                <div className="h-6 w-48 rounded-full bg-white/5 animate-pulse" />
                <div className="space-y-4">
                  <div className="h-10 w-full max-w-xl rounded bg-white/5 animate-pulse" />
                  <div className="h-10 w-3/4 max-w-lg rounded bg-white/5 animate-pulse" />
                  <div className="h-6 w-full max-w-2xl rounded bg-white/5 animate-pulse" />
                  <div className="h-6 w-4/5 max-w-xl rounded bg-white/5 animate-pulse" />
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="h-12 w-48 rounded-2xl bg-white/5 animate-pulse" />
                  <div className="h-12 w-40 rounded-2xl bg-white/5 animate-pulse" />
                </div>
                <div className="rounded-2xl border-2 border-dashed border-[#2a303d] bg-white/5 p-4">
                  <div className="h-4 w-20 rounded bg-white/5 animate-pulse" />
                  <div className="mt-2 h-4 w-full rounded bg-white/5 animate-pulse" />
                  <div className="mt-1 h-4 w-4/5 rounded bg-white/5 animate-pulse" />
                </div>
                <div className="rounded-2xl border-2 border-dashed border-[#2a303d] bg-white/5 p-4">
                  <div className="h-4 w-36 rounded bg-white/5 animate-pulse" />
                  <div className="mt-2 h-4 w-full rounded bg-white/5 animate-pulse" />
                  <div className="mt-1 h-4 w-full rounded bg-white/5 animate-pulse" />
                </div>
              </div>

              {/* Right: Snapshot + AI Bullet cards */}
              <div className="flex flex-1 flex-col gap-5 lg:max-w-sm">
                <div className="rounded-2xl border border-[#1c1f29] bg-[#15171c]/90 p-6">
                  <div className="h-6 w-44 rounded bg-white/5 animate-pulse" />
                  <div className="mt-2 h-4 w-full rounded bg-white/5 animate-pulse" />
                  <div className="mt-4 h-20 rounded-2xl border-2 border-dashed border-[#2d323d] bg-[#1a1d24] animate-pulse" />
                  <div className="mt-4 h-16 rounded-2xl border-2 border-dashed border-[#2d323d] bg-[#1a1d24] animate-pulse" />
                </div>
                <div className="rounded-2xl border-2 border-dashed border-[#2a303d] bg-[#111219]/80 p-4">
                  <div className="h-4 w-32 rounded bg-white/5 animate-pulse" />
                  <div className="mt-1 h-3 w-4/5 rounded bg-white/5 animate-pulse" />
                  <div className="mt-3 flex gap-2">
                    <div className="h-14 flex-1 rounded-xl bg-[#1a1d24] animate-pulse" />
                    <div className="h-14 flex-1 rounded-xl bg-[#1a1d24] animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* What you get */}
          <section className="space-y-5" aria-hidden>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-white/5 animate-pulse" />
                <div className="h-9 w-96 max-w-full rounded bg-white/5 animate-pulse" />
              </div>
              <div className="h-4 w-56 rounded bg-white/5 animate-pulse" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="flex flex-row items-center gap-4 rounded-2xl border-2 border-dashed border-[#2d313a] bg-[#15171c]/80 p-6"
                >
                  <div className="size-12 shrink-0 rounded-2xl bg-[#1f2330]/80 animate-pulse" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-5 w-3/4 rounded bg-white/5 animate-pulse" />
                    <div className="h-4 w-full rounded bg-white/5 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Why + Ready */}
          <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]" aria-hidden>
            <div className="rounded-2xl border-2 border-dashed border-[#2d313a] bg-[#15171c]/80 p-6">
              <div className="h-3 w-24 rounded bg-white/5 animate-pulse" />
              <div className="mt-3 h-8 w-full max-w-md rounded bg-white/5 animate-pulse" />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="size-5 shrink-0 rounded bg-white/5 animate-pulse" />
                    <div className="h-4 flex-1 rounded bg-white/5 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border-2 border-dashed border-[#2d313a] bg-gradient-to-br from-[#14151d] to-[#0f1016] p-6">
              <div className="h-3 w-28 rounded bg-white/5 animate-pulse" />
              <div className="mt-3 h-7 w-full rounded bg-white/5 animate-pulse" />
              <div className="mt-4 h-4 w-4/5 rounded bg-white/5 animate-pulse" />
              <div className="mt-6 h-12 w-full rounded-2xl bg-white/5 animate-pulse" />
            </div>
          </section>

          {/* Footer */}
          <footer
            className="mt-4 border-t border-[#1d2028] pt-6"
            aria-hidden
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="h-4 w-40 rounded bg-white/5 animate-pulse" />
                <div className="h-3 w-64 rounded bg-white/5 animate-pulse" />
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="h-8 w-24 rounded-full bg-white/5 animate-pulse" />
                <div className="h-8 w-28 rounded-full bg-white/5 animate-pulse" />
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
