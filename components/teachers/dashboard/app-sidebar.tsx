"use client";

import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/teachers/dashboard/nav-documents";
import { NavMain } from "@/components/teachers/dashboard/nav-main";
import { NavSecondary } from "@/components/teachers/dashboard/nav-secondary";
import { NavUser } from "@/components/teachers/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

// 1. Data for NavMain (Main tasks)
const navMain = [
  {
    title: "Overview",
    url: "/teachers/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Classes",
    url: "/teachers/classes",
    icon: IconUsers,
  },
  {
    title: "Gradebook",
    url: "/teachers/gradebook",
    icon: IconChartBar,
  },
];

// 2. Data for NavDocuments (Learning materials management)
const documents = [
  {
    name: "Subjects",
    url: "/teachers/subjects",
    icon: IconFolder,
  },
  {
    name: "Question Bank",
    url: "/teachers/questions",
    icon: IconDatabase,
  },
  {
    name: "AI Exams",
    url: "/teachers/exams",
    icon: IconFileAi,
  },
  {
    name: "Activities",
    url: "/teachers/activities",
    icon: IconListDetails,
  },
];

// 3. Data for NavSecondary (Settings)
const navSecondary = [
  {
    title: "Settings",
    url: "/teachers/settings",
    icon: IconSettings,
  },
  {
    title: "Help",
    url: "/teachers/help",
    icon: IconHelp,
  },
];

// 4. User data (Mock - will be fetched from API)
const user = {
  name: "Teacher Name", // Will be fetched from API
  email: "teacher@example.com", // Will be fetched from API
  avatar: "https://github.com/shadcn.png", // Will be fetched from API
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/teachers/dashboard">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">LMS Math Exam</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavDocuments items={documents} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
