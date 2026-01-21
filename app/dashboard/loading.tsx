export default function Loading() {
  return (
    <div className="relative min-h-screen bg-[#101113] text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-[#11131a] via-[#0d0e12] to-[#09090b]" />

      <main className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          {/* Top row: Welcome + Sign Out */}
          <div className="flex items-center justify-between" aria-hidden>
            <div className="space-y-2">
              <div className="h-11 w-56 rounded bg-white/5 animate-pulse sm:h-12 sm:w-64" />
              <div className="h-7 w-48 rounded bg-white/5 animate-pulse" />
              <div className="mt-4 h-6 w-72 rounded bg-white/5 animate-pulse" />
            </div>
            <div className="h-10 w-24 shrink-0 rounded-xl bg-white/5 animate-pulse" />
          </div>

          {/* Two cards */}
          <div className="grid gap-6 md:grid-cols-2" aria-hidden>
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl border-2 border-dashed border-[#2d313a] bg-[#15171c]/80 p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="size-12 shrink-0 rounded-2xl bg-[#1f2330]/80 animate-pulse" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-6 w-36 rounded bg-white/5 animate-pulse" />
                    <div className="h-4 w-full max-w-xs rounded bg-white/5 animate-pulse" />
                  </div>
                </div>
                <div className="mt-6 h-10 w-full rounded-xl bg-white/5 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
