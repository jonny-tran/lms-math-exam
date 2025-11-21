"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { adminService } from "@/services/admin-service";
import { TeacherDto, TeacherStatus } from "@/types/admin-types";
import { createColumns } from "./columns";
import { TeachersDataTable } from "./teachers-table";

export default function TeachersPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<TeacherDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());

  const fetchTeachers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAllTeachers();
      setTeachers(data);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { error?: string } | undefined)?.error ??
          error.message
        : (error as Error).message;
      toast.error(`Lỗi khi tải danh sách giáo viên: ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTeachers();
  }, [fetchTeachers]);

  const handleStatusChange = useCallback(
    async (teacherId: number, newStatus: TeacherStatus) => {
      if (updatingIds.has(teacherId)) return;

      setUpdatingIds((prev) => new Set(prev).add(teacherId));
      try {
        await adminService.updateTeacherStatus(teacherId, newStatus);
        toast.success("Cập nhật trạng thái thành công");
        // Refresh data
        await fetchTeachers();
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? (error.response?.data as { error?: string } | undefined)?.error ??
            error.message
          : (error as Error).message;
        toast.error(`Lỗi khi cập nhật trạng thái: ${message}`);
      } finally {
        setUpdatingIds((prev) => {
          const next = new Set(prev);
          next.delete(teacherId);
          return next;
        });
      }
    },
    [updatingIds, fetchTeachers]
  );

  const handleViewDetails = useCallback(
    (teacherId: number) => {
      // TODO: Navigate to teacher details page
      router.push(`/admin/teachers/${teacherId}`);
    },
    [router]
  );

  // Create columns with callbacks
  const columnsWithActions = createColumns(
    handleViewDetails,
    handleStatusChange,
    updatingIds
  );

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 lg:gap-8 lg:p-6">
      {/* Page Title & Description */}
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold md:text-2xl">
          Quản lý Giáo viên
        </h1>
        <p className="text-muted-foreground">
          Xem danh sách, chi tiết và quản lý trạng thái tài khoản giáo viên.
        </p>
      </div>

      {/* Render the data table */}
      <TeachersDataTable
        columns={columnsWithActions}
        data={teachers}
        isLoading={isLoading}
        emptyMessage="Không có giáo viên nào."
      />
    </main>
  );
}

