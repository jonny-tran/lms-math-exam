"use client";

import * as React from "react";
import {
  IconDashboard,
  IconSchool,
  IconLayoutGrid,
  IconTestPipe,
  IconClipboardList,
  IconBrain,
  IconDatabase,
  IconMessageChatbot,
  IconSettings,
  IconHelp,
  IconInnerShadowTop,
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
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import Link from "next/link";

// 1. Main Navigation (Core Teacher Workflow)
const navMain = [
  {
    title: "Dashboard",
    url: "/teachers/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Classes",
    url: "/teachers/classes",
    icon: IconSchool,
  },
  {
    title: "Activities",
    url: "/teachers/activities",
    icon: IconLayoutGrid,
  },
  {
    title: "Exams",
    url: "/teachers/exams",
    icon: IconTestPipe,
  },
  {
    title: "Gradebook",
    url: "/teachers/gradebook",
    icon: IconClipboardList,
  },
];

// 2. AI & Content Group (Re-using NavDocuments component)
const navAiContent = [
  {
    name: "AI Chat",
    url: "/teachers/ai/chat",
    icon: IconMessageChatbot,
  },
  {
    name: "AI Syllabus",
    url: "/teachers/ai/syllabus",
    icon: IconBrain,
  },
  {
    name: "Question Bank",
    url: "/teachers/ai/questions",
    icon: IconDatabase,
  },
];

// 3. Secondary Navigation
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

// 4. User Data (Mocked)
const user = {
  name: "Teacher Name",
  email: "teacher@example.com",
  avatar: "https://github.com/shadcn.png",
};

export function AppSidebar({
  isLoading = false,
  ...props
}: React.ComponentProps<typeof Sidebar> & { isLoading?: boolean }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {isLoading ? (
              <SidebarMenuSkeleton showIcon className="h-9" />
            ) : (
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:p-1.5!"
              >
                <Link href="/teachers/dashboard">
                  <IconInnerShadowTop className="size-5!" />
                  <span className="text-base font-semibold">LMS Math Exam</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Pass new navMain data */}
        <NavMain items={navMain} isLoading={isLoading} />
        {/* Pass new navAiContent data to NavDocuments component */}
        <NavDocuments items={navAiContent} isLoading={isLoading} />
        {/* Pass new navSecondary data */}
        <NavSecondary items={navSecondary} className="mt-auto" isLoading={isLoading} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} isLoading={isLoading} />
      </SidebarFooter>
    </Sidebar>
  );
}
