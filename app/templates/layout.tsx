import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth/getUser";

export const metadata = {
  title: "Templates",
};

export default async function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login?redirect=/templates");
  }

  return <>{children}</>;
}
