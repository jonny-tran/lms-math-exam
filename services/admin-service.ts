import axios from "axios";
import { http } from "@/lib/http";
import {
  StudentDto,
  TeacherDto,
  UpdateStudentStatusRequest,
  UpdateTeacherStatusRequest,
  StudentStatus,
  TeacherStatus,
} from "@/types/admin-types";

const handleAdminError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    throw error;
  }
  throw error;
};

/**
 * Get all students
 * GET /api/Student
 */
const getAllStudents = async (): Promise<StudentDto[]> => {
  try {
    const { data } = await http.get<StudentDto[]>("/student");
    return data;
  } catch (error) {
    throw handleAdminError(error);
  }
};

/**
 * Get student by ID
 * GET /api/Student/{id}
 */
const getStudentById = async (id: number): Promise<StudentDto> => {
  try {
    const { data } = await http.get<StudentDto>(`/student/${id}`);
    return data;
  } catch (error) {
    throw handleAdminError(error);
  }
};

/**
 * Update student status
 * PUT /api/Student/{id}/status
 */
const updateStudentStatus = async (
  id: number,
  status: StudentStatus
): Promise<{ message: string }> => {
  try {
    const payload: UpdateStudentStatusRequest = { status };
    const { data } = await http.put<{ message: string }>(
      `/student/${id}`,
      payload
    );
    return data;
  } catch (error) {
    throw handleAdminError(error);
  }
};

/**
 * Get all teachers
 * GET /api/Teacher
 */
const getAllTeachers = async (): Promise<TeacherDto[]> => {
  try {
    const { data } = await http.get<TeacherDto[]>("/teachers");
    return data;
  } catch (error) {
    throw handleAdminError(error);
  }
};

/**
 * Get teacher by ID
 * GET /api/Teacher/{id}
 */
const getTeacherById = async (id: number): Promise<TeacherDto> => {
  try {
    const { data } = await http.get<TeacherDto>(`/teachers/${id}`);
    return data;
  } catch (error) {
    throw handleAdminError(error);
  }
};

/**
 * Update teacher status
 * PUT /api/Teacher/{id}/status
 */
const updateTeacherStatus = async (
  id: number,
  status: TeacherStatus
): Promise<{ message: string }> => {
  try {
    const payload: UpdateTeacherStatusRequest = { status };
    const { data } = await http.put<{ message: string }>(
      `/teachers/${id}`,
      payload
    );
    return data;
  } catch (error) {
    throw handleAdminError(error);
  }
};

export const adminService = {
  getAllStudents,
  getStudentById,
  updateStudentStatus,
  getAllTeachers,
  getTeacherById,
  updateTeacherStatus,
};
