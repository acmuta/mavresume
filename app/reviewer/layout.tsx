import { BuilderSidebar } from "@/components/elements/builder/BuilderSidebar";

export const metadata = {
  title: "Reviewer",
};

export default function ReviewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-[#101113] text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-[#11131a] via-[#0d0e12] to-[#09090b]" />
      <BuilderSidebar />
      <main className="relative z-10 min-h-screen md:ml-[6vw]">{children}</main>
    </div>
  );
}
