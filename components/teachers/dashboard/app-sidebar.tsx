"use client";

import * as React from "react";
import Link from "next/link";
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
  IconBooks,
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
import { useAuth } from "@/hooks/use-auth";
import type { MeResponse } from "@/types/auth";

// 1. Main Navigation (Core Teacher Workflow)
const navMain = [
  {
    title: "Dashboard",
    url: "/teachers/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Subjects",
    url: "/teachers/subjects",
    icon: IconBooks,
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

const getFallbackInitials = (email?: string) => {
  if (!email) {
    return "T";
  }

  const [first] = email;
  return first.toUpperCase();
};

export function AppSidebar({
  isLoading = false,
  ...props
}: React.ComponentProps<typeof Sidebar> & { isLoading?: boolean }) {
  const { getCurrentUser } = useAuth();
  const [teacher, setTeacher] = React.useState<MeResponse | null>(null);
  const [pending, setPending] = React.useState<boolean>(false);

  const fetchTeacher = React.useCallback(async () => {
    setPending(true);
    try {
      const data = await getCurrentUser();
      setTeacher(data);
    } catch {
      setTeacher(null);
    } finally {
      setPending(false);
    }
  }, [getCurrentUser]);

  React.useEffect(() => {
    fetchTeacher();
  }, [fetchTeacher]);

  const userDisplay = React.useMemo(() => {
    if (!teacher) {
      return {
        name: "Teacher",
        email: "teacher@example.com",
        avatar: "",
        initials: "T",
      };
    }

    return {
      name: teacher.username ?? teacher.email,
      email: teacher.email,
      avatar: "",
      initials: getFallbackInitials(teacher.email),
    };
  }, [teacher]);

  const computedLoading = isLoading || pending;

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
                  <span className="text-base font-semibold">LMS Math</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} isLoading={computedLoading} />
        <NavDocuments items={navAiContent} isLoading={computedLoading} />
        <NavSecondary
          items={navSecondary}
          className="mt-auto"
          isLoading={computedLoading}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: userDisplay.name,
            email: userDisplay.email,
            avatar: userDisplay.avatar,
            initials: userDisplay.initials,
          }}
          isLoading={computedLoading}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
