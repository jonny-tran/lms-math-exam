"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { LogOut } from "lucide-react";
import { adminService } from "@/services/admin-service";
import {
  StudentDto,
  StudentStatus,
  TeacherDto,
  TeacherStatus,
} from "@/types/admin-types";
import { createColumns as createStudentColumns } from "./students/columns";
import { createColumns as createTeacherColumns } from "./teachers/columns";
import { StudentsDataTable } from "./students/students-table";
import { TeachersDataTable } from "./teachers/teachers-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function AdminPage() {
  const router = useRouter();
  const { logout, clearError } = useAuth();
  const [isPending, startTransition] = useTransition();

  // Students state
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState<boolean>(true);
  const [updatingStudentIds, setUpdatingStudentIds] = useState<Set<number>>(
    new Set()
  );

  // Teachers state
  const [teachers, setTeachers] = useState<TeacherDto[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState<boolean>(true);
  const [updatingTeacherIds, setUpdatingTeacherIds] = useState<Set<number>>(
    new Set()
  );

  // Fetch students
  const fetchStudents = useCallback(async () => {
    setIsLoadingStudents(true);
    try {
      const data = await adminService.getAllStudents();
      setStudents(data);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { error?: string } | undefined)?.error ??
          error.message
        : (error as Error).message;
      toast.error(`Error loading students list: ${message}`);
    } finally {
      setIsLoadingStudents(false);
    }
  }, []);

  // Fetch teachers
  const fetchTeachers = useCallback(async () => {
    setIsLoadingTeachers(true);
    try {
      const data = await adminService.getAllTeachers();
      setTeachers(data);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { error?: string } | undefined)?.error ??
          error.message
        : (error as Error).message;
      toast.error(`Error loading teachers list: ${message}`);
    } finally {
      setIsLoadingTeachers(false);
    }
  }, []);

  useEffect(() => {
    void fetchStudents();
    void fetchTeachers();
  }, [fetchStudents, fetchTeachers]);

  // Student handlers
  const handleStudentStatusChange = useCallback(
    async (studentId: number, newStatus: StudentStatus) => {
      if (updatingStudentIds.has(studentId)) return;

      setUpdatingStudentIds((prev) => new Set(prev).add(studentId));
      try {
        await adminService.updateStudentStatus(studentId, newStatus);
        toast.success("Status updated successfully");
        await fetchStudents();
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? (error.response?.data as { error?: string } | undefined)?.error ??
            error.message
          : (error as Error).message;
        toast.error(`Error updating status: ${message}`);
      } finally {
        setUpdatingStudentIds((prev) => {
          const next = new Set(prev);
          next.delete(studentId);
          return next;
        });
      }
    },
    [updatingStudentIds, fetchStudents]
  );

  const handleStudentViewDetails = useCallback(
    (studentId: number) => {
      router.push(`/admin/students/${studentId}`);
    },
    [router]
  );

  // Teacher handlers
  const handleTeacherStatusChange = useCallback(
    async (teacherId: number, newStatus: TeacherStatus) => {
      if (updatingTeacherIds.has(teacherId)) return;

      setUpdatingTeacherIds((prev) => new Set(prev).add(teacherId));
      try {
        await adminService.updateTeacherStatus(teacherId, newStatus);
        toast.success("Status updated successfully");
        await fetchTeachers();
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? (error.response?.data as { error?: string } | undefined)?.error ??
            error.message
          : (error as Error).message;
        toast.error(`Error updating status: ${message}`);
      } finally {
        setUpdatingTeacherIds((prev) => {
          const next = new Set(prev);
          next.delete(teacherId);
          return next;
        });
      }
    },
    [updatingTeacherIds, fetchTeachers]
  );

  const handleTeacherViewDetails = useCallback(
    (teacherId: number) => {
      router.push(`/admin/teachers/${teacherId}`);
    },
    [router]
  );

  // Create columns with callbacks
  const studentColumns = createStudentColumns(
    handleStudentViewDetails,
    handleStudentStatusChange,
    updatingStudentIds
  );

  const teacherColumns = createTeacherColumns(
    handleTeacherViewDetails,
    handleTeacherStatusChange,
    updatingTeacherIds
  );

  const handleLogout = useCallback(() => {
    startTransition(() => {
      clearError();
      logout();
      router.push("/signin");
    });
  }, [router, logout, clearError]);

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 lg:gap-8 lg:p-6">
      {/* Page Title & Description */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold md:text-2xl">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage students and teachers in the system.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          disabled={isPending}
          className="gap-2"
        >
          <LogOut className="size-4" />
          {isPending ? "Logging out..." : "Log out"}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="students" className="flex flex-col gap-6">
        <TabsList className="w-fit">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="flex flex-col gap-6">
          <StudentsDataTable
            columns={studentColumns}
            data={students}
            isLoading={isLoadingStudents}
            emptyMessage="No students found."
          />
        </TabsContent>

        <TabsContent value="teachers" className="flex flex-col gap-6">
          <TeachersDataTable
            columns={teacherColumns}
            data={teachers}
            isLoading={isLoadingTeachers}
            emptyMessage="No teachers found."
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}
