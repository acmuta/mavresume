export default function Loading() {
  return (
    <div className="min-h-screen bg-[#101113]">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="h-8 w-48 rounded bg-white/5 animate-pulse" />
        <div className="mt-6 h-12 w-full max-w-2xl rounded bg-white/5 animate-pulse" />
        <div className="mt-4 h-6 w-full max-w-xl rounded bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}
