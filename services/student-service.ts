import axios from "axios";
import { http } from "@/lib/http";
import {
  StudentDto,
  CreateStudentRequest,
  ClassDto,
} from "@/types/student-types";

const handleStudentError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    throw error;
  }

  throw error;
};

/**
 * Get student profile by User ID
 * GET /api/Student/by-user/{userId}
 */
const getStudentProfileByUserId = async (
  userId: string
): Promise<StudentDto> => {
  try {
    const { data } = await http.get<StudentDto>(`/student/${userId}`);
    return data;
  } catch (error) {
    throw handleStudentError(error);
  }
};

/**
 * Create student profile (first time login)
 * POST /api/Student
 */
const createStudentProfile = async (
  payload: CreateStudentRequest
): Promise<StudentDto> => {
  try {
    const { data } = await http.post<StudentDto>("/student", payload);
    return data;
  } catch (error) {
    throw handleStudentError(error);
  }
};

/**
 * Get all available classes (Marketplace)
 * GET /api/Class
 */
const getAllAvailableClasses = async (): Promise<ClassDto[]> => {
  try {
    const { data } = await http.get<ClassDto[]>("/classes");
    return data;
  } catch (error) {
    throw handleStudentError(error);
  }
};

/**
 * Get class details by ID
 * GET /api/Class/{id}
 */
const getClassDetails = async (id: number): Promise<ClassDto> => {
  try {
    const { data } = await http.get<ClassDto>(`/classes/${id}`);
    return data;
  } catch (error) {
    throw handleStudentError(error);
  }
};

/**
 * Enroll student in a class
 * POST /api/Student/{studentId}/enroll/{classId}
 */
const enrollStudent = async (
  studentId: number,
  classId: number
): Promise<{ message: string }> => {
  try {
    const { data } = await http.post<{ message: string }>(
      `/classes/${classId}/enrollment/${studentId}`
    );
    return data;
  } catch (error) {
    throw handleStudentError(error);
  }
};

/**
 * Un-enroll (drop) student from a class
 * DELETE /api/Student/{studentId}/unenroll/{classId}
 */
const unenrollStudent = async (
  studentId: number,
  classId: number
): Promise<{ message: string }> => {
  try {
    const { data } = await http.delete<{ message: string }>(
      `/classes/${classId}/unenrollment/${studentId}`
    );
    return data;
  } catch (error) {
    throw handleStudentError(error);
  }
};

export const studentService = {
  getStudentProfileByUserId,
  createStudentProfile,
  getAllAvailableClasses,
  getClassDetails,
  enrollStudent,
  unenrollStudent,
};
