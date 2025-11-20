"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { teacherService } from "@/services/teacher-service";
import { TeacherDto } from "@/types/teacher";

const TEACHER_ID_COOKIE = "teacherId";
const TEACHER_USER_COOKIE = "teacherUserId";

const findTeacherByUserId = (
  teachers: TeacherDto[],
  userId: number
): TeacherDto | undefined => {
  return teachers.find((teacher) => teacher.userId === userId);
};

export const useTeacherIdentity = () => {
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const persistIdentity = useCallback((id: number, userId: number) => {
    const cookieOptions: Cookies.CookieAttributes = {
      path: "/",
      sameSite: "lax",
      expires: 1,
    };

    Cookies.set(TEACHER_ID_COOKIE, String(id), cookieOptions);
    Cookies.set(TEACHER_USER_COOKIE, String(userId), cookieOptions);
  }, []);

  const resolveIdentity = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const me = await teacherService.getMe();
      const meUserId = Number(me.userId);

      if (Number.isNaN(meUserId)) {
        throw new Error("Invalid userId.");
      }

      const cachedTeacherId = Cookies.get(TEACHER_ID_COOKIE);
      const cachedUserId = Cookies.get(TEACHER_USER_COOKIE);

      if (
        cachedTeacherId &&
        cachedUserId &&
        Number(cachedUserId) === meUserId
      ) {
        setTeacherId(Number(cachedTeacherId));
        return;
      }

      const teachers = await teacherService.getAllTeachers();
      let teacher = findTeacherByUserId(teachers, meUserId);

      if (!teacher) {
        teacher = await teacherService.createTeacherProfile({
          userId: meUserId,
          name: me.username || "Teacher",
          bio: "Default Bio",
          department: "General",
          hireDate: new Date().toISOString(),
        });

        toast.success("Teacher profile was automatically created.");
      }

      setTeacherId(teacher.teacherId);
      persistIdentity(teacher.teacherId, meUserId);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { error?: string } | undefined)?.error ??
          err.message
        : (err as Error).message;

      setError(message);
      toast.error(message ?? "Unable to verify teacher.");
    } finally {
      setIsLoading(false);
    }
  }, [persistIdentity]);

  useEffect(() => {
    void resolveIdentity();
  }, [resolveIdentity]);

  const refresh = useCallback(async () => {
    await resolveIdentity();
  }, [resolveIdentity]);

  return {
    teacherId,
    isLoading,
    error,
    refresh,
  };
};
