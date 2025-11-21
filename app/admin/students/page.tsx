"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { adminService } from "@/services/admin-service";
import { StudentDto, StudentStatus } from "@/types/admin-types";
import { createColumns } from "./columns";
import { StudentsDataTable } from "./students-table";

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAllStudents();
      setStudents(data);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { error?: string } | undefined)?.error ??
          error.message
        : (error as Error).message;
      toast.error(`Lỗi khi tải danh sách sinh viên: ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStudents();
  }, [fetchStudents]);

  const handleStatusChange = useCallback(
    async (studentId: number, newStatus: StudentStatus) => {
      if (updatingIds.has(studentId)) return;

      setUpdatingIds((prev) => new Set(prev).add(studentId));
      try {
        await adminService.updateStudentStatus(studentId, newStatus);
        toast.success("Cập nhật trạng thái thành công");
        // Refresh data
        await fetchStudents();
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? (error.response?.data as { error?: string } | undefined)?.error ??
            error.message
          : (error as Error).message;
        toast.error(`Lỗi khi cập nhật trạng thái: ${message}`);
      } finally {
        setUpdatingIds((prev) => {
          const next = new Set(prev);
          next.delete(studentId);
          return next;
        });
      }
    },
    [updatingIds, fetchStudents]
  );

  const handleViewDetails = useCallback(
    (studentId: number) => {
      // TODO: Navigate to student details page
      router.push(`/admin/students/${studentId}`);
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
          Quản lý Sinh viên
        </h1>
        <p className="text-muted-foreground">
          Xem danh sách, chi tiết và quản lý trạng thái tài khoản sinh viên.
        </p>
      </div>

      {/* Render the data table */}
      <StudentsDataTable
        columns={columnsWithActions}
        data={students}
        isLoading={isLoading}
        emptyMessage="Không có sinh viên nào."
      />
    </main>
  );
}

