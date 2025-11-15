import { TeachersLayoutClient } from "@/components/teachers/dashboard/teachers-layout-client";

export default function TeachersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TeachersLayoutClient>{children}</TeachersLayoutClient>;
}
