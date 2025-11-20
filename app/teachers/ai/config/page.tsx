"use client";

import { SiteHeader } from "@/components/teachers/dashboard/site-header";
import { AiConfigManager } from "@/components/teachers/ai/ai-config-manager";
import { useTeacherIdentity } from "@/hooks/use-teacher-identity";
import { Spinner } from "@/components/ui/spinner";

export default function AiConfigPage() {
  const { teacherId, isLoading, error } = useTeacherIdentity();

  if (isLoading) {
    return (
      <>
        <SiteHeader />
        <main className="flex flex-1 flex-col items-center justify-center gap-6 p-4 lg:gap-8 lg:p-6">
          <Spinner className="h-8 w-8" />
          <p className="text-muted-foreground text-sm">
            Đang tải thông tin giáo viên...
          </p>
        </main>
      </>
    );
  }

  if (error || !teacherId) {
    return (
      <>
        <SiteHeader />
        <main className="flex flex-1 flex-col gap-6 p-4 lg:gap-8 lg:p-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold md:text-2xl">
              AI Configuration
            </h1>
            <p className="text-muted-foreground text-sm text-destructive">
              {error || "Không tìm thấy thông tin giáo viên"}
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col gap-6 p-4 lg:gap-8 lg:p-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold md:text-2xl">
            AI Configuration
          </h1>
          <p className="text-muted-foreground">
            Quản lý cấu hình AI cho hệ thống.
          </p>
        </div>
        <AiConfigManager teacherId={teacherId} />
      </main>
    </>
  );
}

