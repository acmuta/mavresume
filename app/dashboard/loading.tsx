export default function Loading() {
  return (
    <div className="relative min-h-screen bg-[#101113]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#11131a] via-[#0d0e12] to-[#09090b]" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="h-12 w-64 rounded bg-white/5 animate-pulse" />
        <div className="mt-6 h-6 w-96 rounded bg-white/5 animate-pulse" />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="h-40 rounded-2xl bg-white/5 animate-pulse" />
          <div className="h-40 rounded-2xl bg-white/5 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
