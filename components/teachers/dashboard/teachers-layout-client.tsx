"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const AppSidebar = dynamic(
  () => import("@/components/teachers/dashboard/app-sidebar").then((mod) => ({ default: mod.AppSidebar })),
  {
    ssr: false,
    loading: () => (
      <div className="w-[var(--sidebar-width)] bg-sidebar border-r border-sidebar-border" />
    ),
  }
);

interface TeachersLayoutClientProps {
  children: React.ReactNode;
}

export function TeachersLayoutClient({
  children,
}: TeachersLayoutClientProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

