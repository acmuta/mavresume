export default function Loading() {
  return (
    <div className="relative min-h-screen bg-[#101113]">
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 md:px-4 md:py-20 lg:px-8">
        <div className="h-14 w-full max-w-2xl rounded-2xl bg-white/5 animate-pulse" />
        <div className="mt-8 h-64 w-full rounded-3xl border-2 border-dashed border-[#2c3037] bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}
