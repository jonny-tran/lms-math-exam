"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { authService } from "@/services/auth-service";
import { studentService } from "@/services/student-service";
import { StudentDto } from "@/types/student-types";

const STUDENT_ID_COOKIE = "studentId";
const STUDENT_USER_COOKIE = "studentUserId";

export const useStudentProfile = () => {
  const [student, setStudent] = useState<StudentDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const persistIdentity = useCallback((studentId: number, userId: number) => {
    const cookieOptions: Cookies.CookieAttributes = {
      path: "/",
      sameSite: "lax",
      expires: 1,
    };

    Cookies.set(STUDENT_ID_COOKIE, String(studentId), cookieOptions);
    Cookies.set(STUDENT_USER_COOKIE, String(userId), cookieOptions);
  }, []);

  const resolveStudentProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get current user info from auth
      const me = await authService.getCurrentUser();
      const meUserId = Number(me.userId);

      if (Number.isNaN(meUserId)) {
        throw new Error("Invalid userId.");
      }

      // Check cached studentId
      const cachedStudentId = Cookies.get(STUDENT_ID_COOKIE);
      const cachedUserId = Cookies.get(STUDENT_USER_COOKIE);

      if (
        cachedStudentId &&
        cachedUserId &&
        Number(cachedUserId) === meUserId
      ) {
        // Try to fetch fresh profile to ensure it's still valid
        try {
          const profile = await studentService.getStudentProfileByUserId(
            String(meUserId)
          );
          setStudent(profile);
          persistIdentity(profile.studentId, meUserId);
          return;
        } catch {
          // If fetch fails, clear cache and continue to full resolution
          Cookies.remove(STUDENT_ID_COOKIE);
          Cookies.remove(STUDENT_USER_COOKIE);
        }
      }

      // Fetch student profile by userId
      try {
        const profile = await studentService.getStudentProfileByUserId(
          String(meUserId)
        );
        setStudent(profile);
        persistIdentity(profile.studentId, meUserId);
      } catch (fetchErr) {
        // If 404, auto-create student profile
        if (axios.isAxiosError(fetchErr) && fetchErr.response?.status === 404) {
          const newProfile = await studentService.createStudentProfile({
            userId: meUserId,
            name: me.username || "Student",
            major: "General",
          });

          setStudent(newProfile);
          persistIdentity(newProfile.studentId, meUserId);
          toast.success("Student profile was automatically created.");
        } else {
          throw fetchErr;
        }
      }
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { error?: string } | undefined)?.error ??
          err.message
        : (err as Error).message;

      setError(message);
      toast.error(message ?? "Unable to verify student profile.");
    } finally {
      setIsLoading(false);
    }
  }, [persistIdentity]);

  useEffect(() => {
    void resolveStudentProfile();
  }, [resolveStudentProfile]);

  const refresh = useCallback(async () => {
    await resolveStudentProfile();
  }, [resolveStudentProfile]);

  return {
    student,
    isLoading,
    isError: error !== null,
    error,
    refresh,
  };
};
